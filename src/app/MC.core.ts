export interface MCField {
  FName: string;
  FCaption: string;
  FType: any;
  FValue: any;
}

export interface MCXfield {
  Fname: string;
  FValue: any;
}

export const Classes: string[] = [
  "OBJC", "RELT", "TAG_", "FOLD", "USER", 
  "STAT", "AUDT", "CONF", "PROC", "PROT", 
  "","","","","",
  "","","","","",
  "TASK"
];

export const UserList : string[] = ["Aitor", "Andrés", "Jaime", "Pedro"];

export class MCObject {
  // Object fields
  private _id: number;
  private _class: number;
  private _name: string;
  private _owner: number;
  private _creator: number;
  private _created: Date;
  private _description: string;

  private _XFields : {[key: string]: any} = [];

  public get id () {
    return Classes[this._class] + this._id.toString().padStart(12,"0");
  };

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
    return this._created;
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

  // MODIFICAR
  public setXField (name: string, value: any) {
    this._XFields[name] = value;
  }


  // TaskObj fields
  status: number;
  dueDate: Date;
  resolvedT: Date;
  closedT: Date;
}
