import { Component, Input, OnInit } from "@angular/core";
import { TaskObj } from "./tasks";
import { TASKS } from "./mock-tasks";

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
  currentUser: number = 0;

  users: string[] = ["Aitor", "Andreas", "Jaime"];
  statuses: string[] = ["to-do", "in progress", "blocked", "verify", "done"];

  newTask: TaskObj = {
    id: 0,
    name: "",
    owner: 0,
    description: "",
    done: false,
    created: new Date(),
    filter: true,
    selected: false,
    status: this.statuses[0],
    creator: this.currentUser,
    dueDate: new Date("2020-01-01")
  };

  newAssignedUser: number = 0;
  newName: string;
  newDescription: string;
  newDueDate: Date;


  ngOnInit() {
    //    this.task_l [0].name = this.name;
    //    this.task_l [0].owner = this.owner;
    //    this.task_l [0].description = this.desc;

    // Retrieve tasks
    this.task_l = TASKS;

    // Parse the initially selected tasks
    for (let i of this.initSelect.split(",", 100)) {
      let n = parseInt(i, 10);
      if (n <= this.task_l.length) this.task_l[n - 1].selected = true;
    }
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

  deleteTasks(): void {
    console.log(this.task_l.length);
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected) this.task_l.splice(i, 1);
    console.log(this.task_l.length);
  }

  areSelectedTasks(): Boolean {
    return this.task_l.filter(x => x.selected).length == 0;
  }

  dueTask(task: TaskObj): Boolean {
    return task.dueDate < new Date() && task.status != "done";
  }
}
