import { Component, VERSION, OnInit } from "@angular/core";
import { MCField } from "./MC.core"
import { TasksCfg } from "./tasks";


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

interface TabObj {
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
  name = "Angular " + VERSION.major;

  MainAppName: string = "TASKS";
  MainViewName: string = "All tasks";

  cfg : MCField[] = TasksCfg;

  TaskVersion: string = "0.0.4";

  TaskAppParams = { 
    initSelect: [3,4],
    currentUser: 0,
    users: ["Aitor", "Andrés", "Jaime"]
  };


  ngOnInit() {
    document.getElementById("defaultOpen").click();
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

