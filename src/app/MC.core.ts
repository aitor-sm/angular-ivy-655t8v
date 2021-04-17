import { FlowActionObj, basicFlow } from "./flows";

export interface MCField {
  FName: string;
  FCaption: string;
  FType: any;
  FValue: any;
}

export const Classes: string[] = [
  "CLAS", "RELT", "TAG_", "FOLD", "USER", 
  "STAT", "AUDT", "CONF", "PROC", "PROT", 
  "","","","","",
  "","","","","",
  "TASK"
];

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

    // accessor properties
    this.name = Name;
    this.owner = Owner;
    this.description = Desc;
    this.status = Status;

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

  public get classId (): number {
    return this._class;
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

  public setXField (name: string, value: any) {
    this._XFields[name] = value;
  }

  public getClassName (): string {
    return Classes[this._class];
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
  public get status (): number {
    return this._status;
  }

  public set status (newStatus: number) {
    if (basicFlow[newStatus].resolutive && !basicFlow[this._status].resolutive)
      this.resolvedT = new Date();

    if (basicFlow[newStatus].terminal) this.closedT = new Date();

    this._status = newStatus;
  }

  public availableActions(): FlowActionObj[] {
    return basicFlow[this._status].actions;
  }

  public isTerminalStatus(): boolean {
    return basicFlow[this._status].terminal;
  }

}
