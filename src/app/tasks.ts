import { MCField, MCParameter, MCObject, MCUXObject } from "./MC.core";


////////////// TASK OBJECT ////////////////

export class TaskObj extends MCUXObject {


  public constructor (Name: string, Owner: number, Desc: string, Status: number, DueDate: Date) {

    super( 100, Name, Owner, Desc, Status);

    this.dueDate = DueDate;

    // DB.View.Obj init
//    this.selected = false;

  }

  public static fromMCObject (o: MCObject): TaskObj {
      return new TaskObj ( o.name, o.owner, o.description, o.status, o.getXField ("DueDate"));
  }

  public get dueDate () {
      return this.getXField ("DueDate");
  }

  public set dueDate (d: Date) {
      this.setXField ("DueDate", d);
  }

  public dueTask(): boolean {
  
/*
    if (this.name == "aaa") { 
//      console.log ("00", this.description, "|", typeof this.dueDate);

    };
*/
    return this.dueDate != null && this.dueDate < new Date() && !this.isTerminalStatus();
  };

}





////////////// TASK CONFIGURATION ////////////////

export var TasksCfg : MCParameter[] = [
  {
    FName: "WarnOnDelete",
    FType: "boolean",
    FOptionality: "mandatory",
    FCaption: "Alert me before deleting a task",
    FValue: true,
    Default: true
  }
]
