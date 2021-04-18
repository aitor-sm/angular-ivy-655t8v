import { MCField, MCObject } from "./MC.core"
import { FlowActionObj, basicFlow } from "./flows";


export class TaskObj extends MCObject {
  private _dueDate: Date;

  // DB.Viewer fields
  filter: boolean;
  selected: boolean;


// ACCESSORS PARA DUE DATE, Hacer filter y selected privados

  public constructor (Name: string, Owner: number, Desc: string, Status: number, DueDate: Date) {

    super( 20, Name, Owner, Desc, Status);

    this.dueDate = DueDate;

    this.filter = true;
    this.selected = false;

  }

  public get dueDate () {
    return this._dueDate;
  }

  public set dueDate (d: Date) {
    this._dueDate = d;
  }

  public dueTask(): boolean {
    return this.dueDate < new Date() && !basicFlow[this.status].terminal;
  };

}

export class TaskList {

  protected task_l    : TaskObj[] = [];

  deleteTask(t: TaskObj) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i] == t) {
        this.task_l.splice(i, 1);
        break;
      }
  }

  numTotalTasks(): number {
    return this.task_l.filter(x => x.filter).length;
  }


  numDueTasks(): number {
    return this.task_l.filter(t => t.dueTask()).length;
  }
 

}


export var TasksCfg : MCField[] = [
  {
    FName: "WarnOnDelete",
    FCaption: "Alert me before deleting a task",
    FType: "boolean",
    FValue: true
  }
]
