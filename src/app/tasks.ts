import { MCField } from "./MC.core"
import { FlowActionObj, basicFlow } from "./flows";


export class TaskObj {
  // Object fields
  id: number;
  name: string;
  owner: number;
  created: Date;
  description: string;
  creator: number;
  // TaskObj fields
  status: number;
  dueDate: Date;
  resolvedT: Date;
  closedT: Date;
  // DB.Viewer fields
  filter: Boolean;
  selected: Boolean;


  public dueTask(): Boolean {
    return this.dueDate < new Date() && !basicFlow[this.status].terminal;
  }

  public changeStatus(newStatus: number) {
    if (basicFlow[newStatus].resolutive && !basicFlow[this.status].resolutive)
      this.resolvedT = new Date();

    if (basicFlow[newStatus].terminal) this.closedT = new Date();

    this.status = newStatus;
  }

  public taskStatusName(): string {
    return basicFlow[this.status].name;
  }

  public availableActions(): FlowActionObj[] {
    return basicFlow[this.status].actions;
  }

}

export class TaskList {

  private task_l    : TaskObj[] = [];
  private idSequence: number = 0;

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
