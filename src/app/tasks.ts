import { MCField, MCParameter, MCObject, MCUXObject, MCFieldType } from "./MC.core";


////////////// TASK OBJECT ////////////////

export class TaskObj extends MCUXObject {


  public constructor (oid: number, Name: string, Type: number, Owner: number, Desc: string, Status: number, DueDate: Date, xf: {[key: string]: any}) {

    super( 100, oid, Type, Name, Owner, Desc, Status, xf);

//    this.dueDate = DueDate;

    // DB.View.Obj init
//    this.selected = false;

  }

  public static fromMCObject (o: MCObject): TaskObj {
      return new TaskObj ( o.nid, o.name, o.type, o.owner, o.description, o.status, o.getXField ("DueDate"), o._XFields);
  }

  public get dueDate () {
      return this.getXField ("DueDate");
  }

  public set dueDate (d: Date) {
      this.setXField ("DueDate", d);
  }

  public dueTask(): boolean {
    return this.dueDate != null && this.dueDate < new Date() && !this.isTerminalStatus();
  };

}





////////////// TASK CONFIGURATION ////////////////

export var TasksCfg : MCParameter[] = [
  {
    name: "WarnOnDelete",
    type: MCFieldType.MCFTboolean,
    FOptionality: "mandatory",
    description: "Alert me before deleting a task",
    FValue: true,
    Default: true
  }
]
