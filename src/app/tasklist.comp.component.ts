import { Component, Input } from '@angular/core';

@Component({
  selector: 'tasklist_comp',
  templateUrl: './tasklist.comp.component.html',
  styleUrls: ['./tasklist.comp.component.css']
})

export class TaskList_comp  {
  @Input() name: string;
  @Input() owner: string;
  @Input() desc: string;
}