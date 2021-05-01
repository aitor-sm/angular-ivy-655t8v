import { FlowActionObj, FlowStatusObj, basicFlow } from "./flows";

export type MCType = "objid" | "auto" | "boolean" | "number" | "string" |"user";

export interface MCField {
  FName: string;
  FCaption: string;
}

export interface MCParameter extends MCField {
  FType: MCType;
  FValue: any;
}

export interface MCDBField extends MCField {
  Show : boolean;
  Access:  "ro" | "rw";
  Width : number;
  Default: any;
}

/*
export const Classes: string[] = [
  "CLAS", "RELT", "TAG_", "FOLD", "USER", 
  "STAT", "AUDT", "CONF", "PROC", "PROT", 
  "","","","","",
  "","","","","",
  "TASK"
]; */

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
  
  // FLOW RELATED FIELDS: temporarily part of BASE
  private _status: number;

  public resolvedT: Date;
  public closedT: Date;

  // Static members
  static sequence: number = 0; // there should be one per class

  private _XFields : {[key: string]: any} = [];

  constructor (ClassId: number, Name: string, Owner: number, Desc: string, Status: number) {
    this._id = MCObject.sequence;
    MCObject.sequence ++;
    
    this._createdT = new Date();
    this._creator = currentUser;

    this._class = ClassId;
    this._XFields = [];

    // accessor properties
    this.name = Name;
    this.owner = Owner;
    this.description = Desc;
    this.status = Status;

    // Temporarily, flow options
    this.resolvedT = null;
    this.closedT = null;


  }

  public clone (): MCObject {
    let a : MCObject = new MCObject (this._class, this._name, this._owner, this._description, this._status);
    
    a.resolvedT = new Date(this.resolvedT);
    a.closedT = new Date (this.closedT);

//    a._XFields = this._XFields.clone();

    this._XFields.forEach(val => a._XFields.push(Object.assign({}, val)));

    return a;
  }

  // READONLY GETTERS

  public get id (): string {
    return this.getClassName() + this._id.toString().padStart(12,"0");
  };

  public get created (): Date {
    return this._createdT;
  }

  public get creator (): number {
    return this._creator;
  }

  public get classId (): string {
    return "CLAS-" +  this.getClassName();
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


  // X-Fields
  public getXField (s: string) {
    return this._XFields[s];
  }

  public addXField (name: string, value: any) {
    this._XFields.push ( {name : value});
  }

  public setXField (name: string, value: any): boolean {
    this._XFields[name] = value;
    return true;
  }

  public getClassName (): string {
  const SysClasses: string[] = [
    "CLAS", "RELT", "TAG_", "FOLD", "USER", 
    "STAT", "AUDT", "CONF", "PROC", "PROT"];
  const AppClasses: string[] = [
    "TASK"];

    if (this._class <100)
      return SysClasses [this._class];
    else
      return AppClasses [this._class-100];
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

  public static getFieldType (f: string): string {
    switch (f) {
      case "id"         :
      case "class"      :  return "objid";
      case "class#"     :
      case "status"     :  return "number";  // TEMPORARY!!!
      case "owner"      :  
      case "creator"    :  return "user";
      case "name"       :  
      case "creatorName":
      case "ownerName"  :
      case "statusName" :   // TEMPORARY!!!
      case "description":  return "string";
      case "createdT"   :
      case "resolvedT"  :
      case "DueDate"    :  // TEMPORARY   X-Field!!!   
      case "closedT"    :  return "date";
      default           :  return "string";
    }
  }

  public getFieldValue (f: string): any {
    switch (f) {
      case "id"         :  return this.id;
      case "class"      :  return this.classId;
      case "class#"     :  return this._class;
      case "status"     :  return this.status;
      case "owner"      :  return this.owner;
      case "creator"    :  return this.creator;
      case "name"       :  return this.name;
      case "creatorName":  return this.getCreatorName();
      case "ownerName"  :  return this.getOwnerName();
      case "statusName" :  return this.getStatusName();
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
      case "status"     :  return false;
      case "owner"      :  this.owner = v; break;
      case "creator"    :  return false;
      case "name"       :  this.name = v; break;
      case "creatorName":  return false;
      case "ownerName"  :  return false;
      case "statusName" :  return false;
      case "description":  this.description = v; break;
      case "createdT"   :  return false;
      case "resolvedT"  :  return false;
      case "closedT"    :  return false;
      default           :  return this.setXField(f, v);
    }
    return true;
  }


}


export class MCUXObject extends MCObject {

  public selected: boolean;

  public constructor (ClassId: number, Name: string, Owner: number, Desc: string, Status: number) {

    super( ClassId, Name, Owner, Desc, Status);

    this.selected = false;

  }

}






