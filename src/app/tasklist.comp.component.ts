import { Component, Input, OnInit } from '@angular/core';
import { TaskObj } from './tasks';
import { TASKS } from './mock-tasks'

@Component({
  selector: 'tasklist_comp',
  templateUrl: './tasklist.comp.component.html',
  styleUrls: ['./tasklist.comp.component.css']
})

export class TaskList_comp implements OnInit {
  @Input() name: string;
  @Input() owner: string;
  @Input() desc: string;
  @Input() initSelect: string;

  task_l = TASKS;
  focus: TaskObj;
  today: Date = new Date();  // shouldn't be constant!! (TO-DO)
  currentUser : string = "Aitor";



  ngOnInit() {
//    this.task_l [0].name = this.name;
//    this.task_l [0].owner = this.owner;
//    this.task_l [0].description = this.desc;
  
//    console.log (this.initSelect);
    for (let i of this.initSelect.split(",",100)){
      let n = parseInt(i,10);
      if (n<=this.task_l.length)
        this.task_l[n-1].selected=true;
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
    for (let i=this.task_l.length-1; i>=0; i--) {
      this.task_l[i].selected = checkbox.checked;
    }
  }

  deleteTasks (): void {
    console.log (this.task_l.length);
    for (let i=this.task_l.length-1; i>=0; i--)
      if (this.task_l[i].selected)
        this.task_l.splice(i,1);
    console.log (this.task_l.length);
  }
}
