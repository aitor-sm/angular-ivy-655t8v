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

  task_l = TASKS;
  
  ngOnInit() {
    this.task_l [0].name = this.name;
    this.task_l [0].owner = this.owner;
    this.task_l [0].description = this.desc;
  }
}