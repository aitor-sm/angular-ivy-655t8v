import { Component, Input, OnInit } from "@angular/core";
import { TaskObj, FlowStatusObj, FlowActionObj } from "./tasks";
import { TASKS } from "./mock-tasks";

  var basicFlow : FlowStatusObj[] = [
    {
      name: "to-do",
      terminal: false,
      resolutive: false,
      actions: [
        {
          nextStatus: 1,
          name: "Start"
        },
        {
          nextStatus: 5,
          name: "Cancel"
        }
      ]
    },
    {
      name: "in progress",
      terminal: false,
      resolutive: false,
      actions: [
        {
          nextStatus: 2,
          name: "Block"
        },
        {
          nextStatus: 3,
          name: "Resolve"
        },
        {
          nextStatus: 5,
          name: "Cancel"
        }
      ]
    },
    {
      name: "blocked",
      terminal: false,
      resolutive: false,
      actions: [
        {
          nextStatus: 1,
          name: "Resume"
        },
        {
          nextStatus: 5,
          name: "Cancel"
        }
      ]
    },
    {
      name: "resolved",
      resolutive: true,
      terminal: false,
      actions: [
        {
          nextStatus: 1,
          name: "Reject"
        },
        {
          nextStatus: 4,
          name: "Verify"
        }
      ]
    },
    {
      name: "done",
      terminal: true,
      resolutive: true,
      actions: [
      ]
    },
    {
      name: "cancelled",
      terminal: true,
      resolutive: true,
      actions: [
      ]
    }
  ]



@Component({
  selector: "tasklist_comp",
  templateUrl: "./tasklist.comp.component.html",
  styleUrls: ["./tasklist.comp.component.css"]
})


export class TaskList_comp implements OnInit {
  //  @Input() name: string;
  //  @Input() owner: string;
  //  @Input() desc: string;
  @Input() initSelect: string;

  task_l: TaskObj[];
  focus: TaskObj;
  idSequence: number;

  currentUser: number = 0;
  users: string[] = ["Aitor", "Andrés", "Jaime"];
  reassignTo : number = 0;
  toDueDate : Date = new Date();

//  statuses: string[] = ["to-do", "in progress", "blocked", "verify", "done", "cancelled"];



  newTaskToggle: boolean = false;




  newTask: TaskObj = {
    id: 0,
    name: "",
    owner: 0,
    description: "",
    created: new Date(),
    filter: true,
    selected: false,
    status: 0,
    creator: this.currentUser,
    dueDate: new Date("2020-01-01"),
    resolvedT: null,
    closedT: null
  };


  ngOnInit() {

    // Retrieve tasks
    this.task_l = TASKS;
    this.idSequence = this.task_l.length;

    // Parse the initially selected tasks
    for (let i of this.initSelect.split(",", 100)) {
      let n = parseInt(i, 10);
      if (n <= this.task_l.length) this.task_l[n - 1].selected = true;
    }

    this.clearNewTaskFields();
  }

  onMouseOver(t: TaskObj): void {
    this.focus = t;
  }

  onMouseOut(t: TaskObj): void {
    this.focus = null;
  }

  onSelectAll(e: Event): void {
    const checkbox = e.target as HTMLInputElement;
    for (let i = this.task_l.length - 1; i >= 0; i--) {
      this.task_l[i].selected = checkbox.checked;
    }
  }

  deleteSelectedTasks(): void {
//    console.log(this.task_l.length);
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected) this.task_l.splice(i, 1);
//    console.log(this.task_l.length);
  }

  numSelectedTasks(): number {
    return (this.task_l.filter(x => (x.selected && x.filter))).length;
  }

  dueTask(task: TaskObj): Boolean {
//    console.log ("Due: "+ task.dueDate);
    return (task.dueDate < new Date()) && ! (basicFlow[task.status].terminal);
  }

  isValidNewTask (): Boolean {
    return (this.newTask.name != "") && (this.newTask.description != "");
  }

  addNewTask (task: TaskObj) {
    task.id = this.idSequence;
    task.created = new Date();

    this.task_l.push (Object.assign({}, task));
//    console.log ("Created task with ID: ",this.idSequence);

    this.idSequence++;
  }

  reassignSelectedTasks (assignee) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected) this.task_l[i].owner = assignee;
  }

  toggleNewTaskBar () {
    this.newTaskToggle = !this.newTaskToggle;
  }

  changeStatus (task: TaskObj, newStatus: number) {
    if (basicFlow[newStatus].resolutive && ! basicFlow[task.status].resolutive)
      task.resolvedT = new Date();
    
    if (basicFlow[newStatus].terminal)
      task.closedT = new Date();

    task.status = newStatus;
  }

  deleteTask (t: TaskObj) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i]==t) this.task_l.splice(i, 1);
  }

  changeDueDateOnSelectedTasks (d: Date) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected) this.task_l[i].dueDate = new Date (this.toDueDate);
//    console.log (this.toDueDate);
//    for (let i = this.task_l.length - 1; i >= 0; i--)
//      console.log (i+"|"+this.task_l[i].selected + "|" + this.task_l[i].dueDate+"|"+typeof(this.task_l[i].dueDate));
  }

  clearNewTaskFields () {
    this.newTask.name = "";
    this.newTask.owner = 0;
    this.newTask.description = "";
    this.newTask.filter = true;
    this.newTask.selected = false;
    this.newTask.status = 0;
    this.newTask.creator = this.currentUser;
    this.newTask.dueDate = new Date("2020-01-01");
  }

  numTotalTasks(): number {
    return (this.task_l.filter(x => (x.filter))).length;
  }

  numDueTasks(): number {
//    return 0;
    return (this.task_l.filter(this.dueTask)).length;
  }

  taskStatusName (t: TaskObj): string {
    return basicFlow[t.status].name;
  }

  availableActions (t: TaskObj): FlowActionObj[] {
    return basicFlow[t.status].actions;
  }

}


