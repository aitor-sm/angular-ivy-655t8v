import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import { MCField, MCParameter, UserList, currentUser } from "./MC.core"
import {TaskList_comp } from "./tasklist.comp.component";
import { TaskObj, TasksCfg } from "./tasks";

/*
function TimeCtrl($scope, $timeout) {
    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms

    var tick = function() {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);
}
*/

export interface TabObj {
  id: string;
  divname: string;
  caption: string;
}

const TABS: TabObj[] = [
  { id: "100", divname:"TASKS-App", caption: "Start page"},
  { id: "101", divname:"TASKS-Cfg", caption: "Settings"},
  { id: "110", divname:"Task-All", caption: "All task"}
];



@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent  implements OnInit {
//  name = "Angular " + VERSION.major;

  MainAppName: string = "TASKS";
  MainViewName: string = "All tasks";

  cfg : MCParameter[] = TasksCfg;
  taskListRendered : boolean = false;

  TaskVersion: string = "0.0.4";

  toDueDate: Date = new Date();

  @ViewChild('MainTaskView') mainTaskViewCpt: TaskList_comp;

  taskStatusBarMessage () : string  {
      if (this.taskListRendered)
//      if (typeof this.mainTaskViewCpt === 'object')
      return "Total: " +
      this.mainTaskViewCpt.numFiltered()+
      " tasks, ("+
      this.mainTaskViewCpt.numSelected()+
      " selected) "+
      this.numDueTasks()+
      " are due"
      else 
        return "Loading..."
  };

  activateTaskBar (b: boolean) {
    this.taskListRendered = b;
  }

  TaskAppParams: object;

  numDueTasks(): number {
      return this.mainTaskViewCpt.getFilteredRecords().filter( t => (t as TaskObj).dueTask()).length;
//      TL.countIf (t => (this.applyFilter(t) && (t as TaskObj).dueTask()));
  }

  changeDueDateOnSelectedTasks(d: Date) {
    this.mainTaskViewCpt.executeOnSelectedRecords ( t => (t as TaskObj).dueDate = new Date(this.toDueDate));
  };




  ngOnInit() {
    document.getElementById("defaultOpen").click();

  this.TaskAppParams = { 
    initSelect: [3,4],
    currentUser: currentUser,
    users: UserList,
    DBName: "Task List",
    DBRecordName: "Task",
    initToolbar: "ToolBar_Item",
  };



  }

  findTabByID (findid: string): TabObj {
    let i: number;
    for (i=0; i<TABS.length; i++)
      if (TABS[i].id==findid)  return TABS[i];
  }

  openTab (evt, tabId) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    let T = this.findTabByID(tabId);
    document.getElementById(T.divname).style.display = "block";
    evt.currentTarget.className += " active";
    this.MainViewName = T.caption;
  }


}




@Component({
  selector: "task-properties",
  templateUrl: "./task-properties.html",
})

export class TaskProperties  implements OnInit, OnChanges {

  @Input() Parameters: object;


  public toDueDate: Date = new Date();
  disabled : boolean = true;


  ngOnInit () {

  }

  ngOnChanges (changes: SimpleChanges): void {
    let change = changes ["Parameters"];
      this.disabled = change.currentValue["disabled"];
  }
/*  
  public get toDueDate () : Date {
    return this._toDueDate;
  }

  public set toDueDate (d:Date)  {
    this._toDueDate = d;
  }
*/
  changeV (e: Event){

  }

}