import { Component, Input, OnInit } from "@angular/core";
//import {MatDialogModule} from '@angular/material/dialog';
import { TaskObj, FlowActionObj, basicFlow } from "./tasks";
import { TASKS } from "./mock-tasks";

@Component({
  selector: "tasklist_comp",
  templateUrl: "./tasklist.comp.component.html",
  styleUrls: ["./tasklist.comp.component.css"]
})
export class TaskList_comp implements OnInit {
  @Input() Parameters: object;

  ///////////////// PROPERTIES

  // Globals
  currentUser: number = 0;
  users: string[] = ["Aitor", "Andrés", "Jaime"];

  // To TaskOBJ
  idSequence: number;

  // To TaskList
  task_l: TaskObj[];

  // From this class
  focus: TaskObj;

  reassignTo: number = 0;
  toDueDate: Date = new Date();

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

  ///////////////// CONSTRUCTOR

  ngOnInit() {
    // Retrieve tasks
    this.task_l = TASKS;
    this.idSequence = this.task_l.length;

    // Parse the initially selected tasks
    this.Parameters["initSelect"].forEach((n: number) => {
      if (n <= this.task_l.length) this.task_l[n - 1].selected = true;
    });

    // Template for new tasks
    this.clearNewTaskFields();
  }

  ///////////////// TASK-OBJ METHODS

  dueTask(task: TaskObj): Boolean {
    return task.dueDate < new Date() && !basicFlow[task.status].terminal;
  }

  changeStatus(task: TaskObj, newStatus: number) {
    if (basicFlow[newStatus].resolutive && !basicFlow[task.status].resolutive)
      task.resolvedT = new Date();

    if (basicFlow[newStatus].terminal) task.closedT = new Date();

    task.status = newStatus;
  }

  taskStatusName(t: TaskObj): string {
    return basicFlow[t.status].name;
  }

  availableActions(t: TaskObj): FlowActionObj[] {
    return basicFlow[t.status].actions;
  }


  ///////////////// TASK-LIST METHODS

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
    return this.task_l.filter(this.dueTask).length;
  }

  addNewTask(task: TaskObj) {
    task.id = this.idSequence;
    task.created = new Date();

    this.task_l.push(Object.assign({}, task));

    this.idSequence++;
  }

  ///////////////// DB.VIEWER METHODS

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
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected) this.task_l.splice(i, 1);
  }

  numSelectedTasks(): number {
    return this.task_l.filter(x => x.selected && x.filter).length;
  }

  isValidNewTask(): Boolean {
    return this.newTask.name != "" && this.newTask.description != "";
  }

  toggleNewTaskBar() {
    this.newTaskToggle = !this.newTaskToggle;
  }

  clearNewTaskFields() {
    this.newTask.name = "";
    this.newTask.owner = 0;
    this.newTask.description = "";
    this.newTask.filter = true;
    this.newTask.selected = false;
    this.newTask.status = 0;
    this.newTask.creator = this.currentUser;
    this.newTask.dueDate = new Date("2020-01-01");
  }

  ///////////////// OWN METHODS

  reassignSelectedTasks(assignee: number) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected) this.task_l[i].owner = assignee;
  }

  changeDueDateOnSelectedTasks(d: Date) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected)
        this.task_l[i].dueDate = new Date(this.toDueDate);
  }
}
