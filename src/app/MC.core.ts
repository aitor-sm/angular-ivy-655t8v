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

export class MCObject {
  private _id: number;
  private _class: number;
  private _name: string;
  private _owner: number;
  private _creator: number;
  private _createdT: Date;
  private _description: string;
  private _status: number;
  // FLOW RELATED FIELDS: temporarily part of BASE
  public resolvedT: Date;
  public closedT: Date;

  private _XFields : {[key: string]: any} = [];

  public get id () {
    return this.getClassName() + this._id.toString().padStart(12,"0");
  };

  public getClassName () {
    return Classes[this._class];
  }

  public getOwnerName () {
    return UserList[this._owner];
  }

  public getCreatorName () {
    return UserList[this._creator];
  }
  
  public get name () {
    return this._name;
  }

  public set name (n: string) {
    this._name = n;
  }

  public get created () {
    return this._createdT;
  }

  public get description () {
    return this._description;
  }

  public set description (d: string) {
    this._description = d;
  }

  public getXField (s: string) {
    return this._XFields[s];
  }

  public addXField (name: string, value: any) {
    this._XFields.push ( {name : value});
  }

  public setXField (name: string, value: any) {
    this._XFields[name] = value;
  }

  // This shouldn't be relative to basicFlow, but to the flow of the type
  public taskStatusName(): string {
    return basicFlow[this._status].name;
  }


  // FLOW RELATED METHODS: temporarily part of BASE
  public changeStatus(newStatus: number) {
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
