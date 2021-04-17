import { MCField } from "./MC.core"
import { FlowActionObj, basicFlow } from "./flows";


export class TaskObj {
  // Object fields
  id: number;
  name: string;
  owner: number;
  createdT: Date;
  description: string;
  creator: number;
  status: number;
  // Temporarily object specific fields
  resolvedT: Date;
  closedT: Date;
  // TaskObj fields
  dueDate: Date;
  // DB.Viewer fields
  filter: Boolean;
  selected: Boolean;


  public dueTask(): Boolean {
    return this.dueDate < new Date() && !basicFlow[this.status].terminal;
  };

  // SO FAR OBJECT SPECIFIC
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

  protected task_l    : TaskObj[] = [];
  protected idSequence: number = 0;

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
