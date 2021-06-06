import { FlowActionObj, FlowStatusObj, basicFlow } from "./flows";

//export type MCType = "objid" | "auto" | "boolean" | "number" | "string" |"date" | "user" | "status";

export enum MCFieldType {
  MCFTobjid,
  MCFTboolean,
  MCFTnumber,
  MCFTstring,
  MCFTdate,
  MCFTstatus,
  MCFTuser = 100
}

export interface MCField {
  name: string;  
  type: number;   // type (new)
  description: string; 
  FOptionality: "optional" | "mandatory";
  Default: any;
}

export interface MCParameter extends MCField {
  FValue: any;
}


export const UserList : string[] = ["Aitor", "Andrés", "Jaime", "Pedro"];
export var currentUser : number = 0;


export class MCObject {

  // Inmutable automatic fields
  private _id: number;
  private _creator: number;
  private _createdT: Date;
  // Inmutable fields
  private _class: number;

  // Mutable fields
  private _name: string;
  private _owner: number;
  private _description: string;
  private _type: number;
  
  public _XFields : {[key: string]: any} = {};

  // FLOW RELATED FIELDS: temporarily part of BASE
  private _status: number;

  public resolvedT: Date;
  public closedT: Date;

  // Static members
  private static sequence: number = 0; // there should be one per class


  constructor (ClassId: number, oid: number, TypeId: number, Name: string, Owner: number, Desc: string, Status: number, xf: {[key: string]: any}) {
    
    if (oid < 0 ) {
      this._id = MCObject.sequence;
      MCObject.sequence ++;
    }
    else
      this._id = oid;
    
    this._createdT = new Date();
    this._creator = currentUser;

    this._class = ClassId;
    this._XFields = [];
    this.copyXFields (xf);

    // accessor properties
    this.name = Name;
    this.owner = Owner;
    this.description = Desc;
    this.status = Status;
    this.type = TypeId;

    // Temporarily, flow options
    this.resolvedT = null;
    this.closedT = null;

//    console.log ("constr:", this._id, this.name);


  }

  public copyXFields ( xf: {[key: string]: any}) {
    for (let key of Object.keys(xf)) {
      this._XFields[key] = JSON.parse(JSON.stringify(xf[key]));
    }
  }

  public clone (): MCObject {
    let a : MCObject = new MCObject (this._class, this.nid, this.type, this._name, this._owner, this._description, this._status, this._XFields);
    
    a.resolvedT = new Date(this.resolvedT);
    a.closedT = new Date (this.closedT);

//    this._XFields.forEach(val => {console.log ("XX=",val); a._XFields.push(Object.assign({}, val))});

//    a.copyXFields (this._XFields);

/*
    for (let key of Object.keys(this._XFields)) {
      a._XFields[key] = JSON.parse(JSON.stringify(this._XFields[key]));
    }
*/
    return a;
  }

  // READONLY GETTERS

  public get id (): string {
//      console.log ("CLID=",this._class);
//      console.log ("ID=",this._id);
      return MCObject.getObjid (this._class, this._id);
//    return MCObject.getClassName(this._class) + this._id.toString().padStart(12,"0");
  };

  public static getObjid (classId: number, NobjId: number) : string {
//    console.log ("classId=", classId);
//    console.log ("objID=", NobjId);
    return MCObject.getClassName(classId) + NobjId.toString().padStart(12,"0");
  }

  public get nid (): number {
    return this._id;
  }

  public get created (): Date {
    return this._createdT;
  }

  public get creator (): number {
    return this._creator;
  }

  public get classId (): string {
    return "CLAS-" +  MCObject.getClassName(this._class);
  }

  public static getClassName (c: number): string {
  const SysClasses: string[] = [
    "CLAS", "RELT", "TAG_", "FOLD", "USER", 
    "STAT", "AUDT", "CONF", "PROC", "PROT",
    "VIEW", "FELD"];
  const AppClasses: string[] = [
    "TASK"];

    if (c <100)
      return SysClasses [c];
    else
      return AppClasses [c-100];
  }


  // ACCESSORS FOR BASIC PROPERTIES 
  public get name (): string {
    return this._name;
  }

  public set name (n: string) {
    this._name = n;
  }

  public get owner (): number {
    return this._owner;
  }

  public set owner (newOwner: number) {
    this._owner = newOwner;
  }

  public get description () {
    return this._description;
  }

  public set description (d: string) {
    this._description = d;
  }

  public get type (): number {
    return this._type;
  }

  public set type (n: number) {
    this._type = n;
  }




  // X-Fields
  public getXField (s: string) {
    return this._XFields[s];
  }

  public setXField (name: string, value: any): boolean {
    this._XFields[name] = value;
    return true;
  }


  // TEXTUAL DESCRIPTIONS
  public getOwnerName (): string {
    return UserList[this._owner];
  }

  public getCreatorName (): string {
    return UserList[this._creator];
  }
  
  // This shouldn't be relative to basicFlow, but to the flow of the type
  public getStatusName(): string {
    return basicFlow[this._status].name;
  }

  // FLOW RELATED METHODS: temporarily part of BASE
  public isTerminalStatus (a?: FlowStatusObj): boolean {
    let f : FlowStatusObj = (typeof a !== 'undefined')?a : basicFlow[this._status];
    return f.actions.length == 0
  }

  public get status (): number {
    return this._status;
  }

  public set status (newStatus: number) {
    if (basicFlow[newStatus].resolutive && !basicFlow[this._status].resolutive)
      this.resolvedT = new Date();

    if (this.isTerminalStatus (basicFlow[newStatus])) this.closedT = new Date();

    this._status = newStatus;
  }

  public availableActions(): FlowActionObj[] {
    return basicFlow[this._status].actions;
  }

/*
  public isTerminalStatus(): boolean {
    return basicFlow[this._status].terminal;
  }
*/

  public getFieldValue (f: string): any {
    switch (f) {
      case "id"         :  return this.id;
      case "class"      :  return this.classId;
      case "class#"     :  return this._class;
      case "status"     :  return this.status;
      case "owner"      :  return this.owner;
      case "creator"    :  return this.creator;
      case "name"       :  return this.name;
      case "description":  return this.description;
      case "createdT"   :  return this.created;
      case "resolvedT"  :  return this.resolvedT;
      case "closedT"    :  return this.closedT;
      default           :  return this.getXField(f);
    }
  }

  public setFieldValue (f: string, v: any): boolean {
    switch (f) {
      case "id"         :  return false;
      case "class"      :  return false;
      case "class#"     :  return false;
      case "status"     :  this.status = v; break;
      case "owner"      :  this.owner = v; break;
      case "creator"    :  return false;
      case "name"       :  this.name = v; break;
      case "description":  this.description = v; break;
      case "createdT"   :  return false;
      case "resolvedT"  :  return false;
      case "closedT"    :  return false;
      default           :  return this.setXField(f, v);
    }
    return true;
  }

  public validateNewObject(): boolean {
    return this.name != "" ;
  }

  writeDateField(fieldName: string, d: any) {
    this.setFieldValue(fieldName, new Date(d));
  }


}


export class MCUXObject extends MCObject {

  public selected: boolean;

  public constructor (ClassId: number, oid: number, Type: number, Name: string, Owner: number, Desc: string, Status: number, xf: {[key: string]: any}) {

    super( ClassId, oid, Type, Name, Owner, Desc, Status, xf);

    this.selected = false;

  }

/*
  public clone () : MCUXObject {
    let e : MCUXObject = super.clone() as MCUXObject;
    e.selected = false;

    return e;
  }
*/

  public PixelsToSize (n: number): string {
//    console.log ("pixel2size", n);
    return n==0? '100%' : ''+n/8;
  }

}




////////////// VISUAL OBJECT LIST  ////////////////


export class MCUXList {

  protected obj_l    : MCUXObject[] = [];

  constructor (p: object) {

//    this.retrieveItems();
    if ( typeof p != 'undefined')
    this.bulkSelect (p["initSelect"]);
  }

  // Retrieve specific to TAKS
/*
  retrieveItems ()  {
    this.obj_l.push (new TaskObj ("Programa Tasks", 0, "Crear la versión 0.4", 0, new Date('2021-08-21')));
    this.obj_l.push (new TaskObj ("Clase alemán", 1, "Clase por la tarde", 1, new Date('2021-08-21')));
    this.obj_l.push (new TaskObj ("Deberes", 0, "Descripción 3", 2, new Date('2021-08-21')));
//    this.obj_l.push (new MCUXObject (100, "Deberes", 0, "Descripción 3", 2));
  }
*/

  bulkSelect (a: number[]) {
    if (typeof a != 'undefined')
      a.forEach((n: number) => {
        if (n <= this.obj_l.length) this.obj_l[n - 1].selected = true;
      });
  }

 
  public addNewItem(task: MCUXObject) {
//    this.obj_l.push(Object.assign(new TaskObj(), task));
    this.obj_l.push(task);
  }

  public getItem (i: number): MCUXObject {
    return this.obj_l[i];
  }

  public count(): number {
    return this.obj_l.length;
  }

  public countIf(f: (arg0: MCUXObject) => boolean): number {
    return this.obj_l.filter(t => f(t)).length;
  }

  public countSel (): number {
    return this.obj_l.filter(t => t.selected).length;
  }

  public countSelIf(f: (arg0: MCUXObject) => boolean): number {
    return this.obj_l.filter(t => t.selected && f(t)).length;
  }
  public do (f: (arg0: MCUXObject) => void) {
    this.obj_l.forEach (t => f(t));
  }

  public doIf (f: (arg0: MCUXObject) => void, g: (arg0: MCUXObject) => boolean) {
    this.obj_l.filter(t => g(t)).forEach (t => f(t));
  }

  public doSel (f) {
    this.obj_l.filter(t => t.selected).forEach (t => f(t));
  }

  public splice (n: number, m: number) {
    this.obj_l.splice (n,m);
  }

  public indexOf (t: MCUXObject): number {
    return this.obj_l.indexOf (t);
  }

  public deleteSel () {
    this.obj_l = this.obj_l.reduce((p,c) => (!c.selected && p.push(c),p),[]);
  }

  public subFilter (f): MCUXObject[] {
    return this.obj_l.filter (f);
  }

  public selected (): MCUXObject[] {
    return this.obj_l.filter(t => t.selected);
  }

/*
  public validateNewTask = (t: MCUXObject) => {return t.description != "";};

  public highlightTask = (t: MCUXObject) => {return (t as TaskObj).dueTask()};
*/

}


