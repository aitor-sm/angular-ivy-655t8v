import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  ComponentFactoryResolver
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  MCUXObject,
  MCField,
  MCParameter,
  UserList,
  currentUser,
  MCUXList,
  MCObject,
  MCFieldType
} from './MC.core';
import { NCobjectS } from './NCobject.service';
import { basicFlow } from './flows';
import {
  TaskList_comp,
  MCDBField,
  DBViewObject
} from './tasklist.comp.component';
import { TaskObj, TasksCfg } from './tasks';
import { DialogDeleteTasks } from './delete-task-dialog.component';

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
  { id: '100', divname: 'TASKS-App', caption: 'Start page' },
  { id: '101', divname: 'TASKS-Cfg', caption: 'Settings' },
  { id: '110', divname: 'Task-All', caption: 'All task' }
];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //  name = "Angular " + VERSION.major;

  MainAppName: string = 'TASKS';
  MainViewName: string = 'All tasks';

  Fields: MCDBField[] = TaskDBFields;

  cfg: MCParameter[] = TasksCfg;
  curView: DBViewObject = null;
  taskListRendered: boolean = false;

  TaskVersion: string = '0.0.4';
  //  TaskList: MCUXList;

  toDueDate: Date = new Date();

  @ViewChild('MainTaskView') mainTaskViewCpt: TaskList_comp;

  constructor(
    public DeleteTasksDialog: MatDialog,
    private resolver: ComponentFactoryResolver,
    public NCobject: NCobjectS
  ) {
//    console.log ("cons-call");
    if (this.curView == null)
      this.curView = new DBViewObject(this.NCobject.getObjectOfClass(10)[0]);
//    console.log ("end-cons-call");
  }

  taskStatusBarMessage(): string {
    if (this.taskListRendered)
      //      if (typeof this.mainTaskViewCpt === 'object')
      return (
        'Total: ' +
        this.mainTaskViewCpt.numFiltered() +
        ' tasks, (' +
        this.mainTaskViewCpt.numSelected() +
        ' selected) ' +
        this.numDueTasks() +
        ' are due'
      );
    else return 'Loading...';
  }

  onFinishRender(b: boolean) {
    this.taskListRendered = b;

    /*
    this.mainTaskViewCpt.addRecord (new TaskObj ("Programa Tasks", 0, "Crear la versi??n 0.4", 0, new Date('2021-08-21')));
    this.mainTaskViewCpt.addRecord (new TaskObj ("Clase alem??n", 1, "Clase por la tarde", 1, new Date('2021-08-21')));
    this.mainTaskViewCpt.addRecord (new TaskObj ("Deberes", 0, "Descripci??n 3", 2, new Date('2021-08-21')));
*/

//    console.log ("finishrender");
    let a: MCObject[] = this.NCobject.getObjectOfClass(100);
//    console.log ("end-finishrender");
    a.forEach(o => this.mainTaskViewCpt.addRecord(TaskObj.fromMCObject(o)));
  }

  TaskAppParams: object;

  numDueTasks(): number {
    return this.mainTaskViewCpt
      .getFilteredRecords()
      .filter(t => (t as TaskObj).dueTask()).length;
    //      TL.countIf (t => (this.applyFilter(t) && (t as TaskObj).dueTask()));
  }

  changeDueDateOnSelectedTasks(d: Date) {
    this.mainTaskViewCpt.executeOnSelectedRecords(
      t => ((t as TaskObj).dueDate = new Date(d))
    );
  }

  changeDueDateOnSelectedTasks2(o: object) {
    //    console.log ("D2=", o);
    this.changeDueDateOnSelectedTasks(o as Date);
  }

  ngOnInit() {
    document.getElementById('defaultOpen').click();

    let factory = this.resolver.resolveComponentFactory(TaskProperties);

    this.TaskAppParams = {
      initSelect: [3, 4],
      currentUser: currentUser,
      users: UserList,
      DBName: 'Task List',
      DBRecordName: 'Task',
      initToolbar: 'ToolBar_Item',
      RecPropFactory: factory,
      RecClassId: 100,
      validateNewRecord: this.validateNewTask,
      highlightRecord: this.highlightTask
    };
//    console.log ("view:", this.curView.id);
  }

  addTask(o: MCUXObject) {
    let t = this.NCobject.createObject (100, o.type, o.name, o.owner, o.description, o.status, o._XFields);

/*    
    new TaskObj(
      -1,
      o.name,
      o.type,
      o.owner,
      o.description,
      o.status,
      o.getXField('DueDate'),
      []
    );
*/
    //    console.log ("D=", o.getXField("DueDate"));
    //    console.log ("T=", t.getXField("DueDate"));

    this.mainTaskViewCpt.addRecord(TaskObj.fromMCObject(t));
  }

  deleteTasks(o: number) {
    if (TasksCfg.find(a => a.name == 'WarnOnDelete').FValue) {
      let dialogRef = this.DeleteTasksDialog.open(DialogDeleteTasks, {
        height: '200px',
        width: '100%',
        data: {
          numberOfRecords: o == 0 ? 1 : this.mainTaskViewCpt.numSelected(),
          confirmation: true,
          doIt: true,
          recordName: this.TaskAppParams['DBRecordName']
        },
        panelClass: 'custom-modalbox-error'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (typeof result != 'undefined') {
          TasksCfg.find(a => a.name == 'WarnOnDelete').FValue =
            result.confirmation;

          //          if (result.doIt) this.doDeleteTasks(o);
          if (result.doIt) this.mainTaskViewCpt.doDeleteTasks(o);
        }
      });
    } else this.mainTaskViewCpt.doDeleteTasks(o);
    //    } else this.doDeleteTasks(o);
  }

  findTabByID(findid: string): TabObj {
    let i: number;
    for (i = 0; i < TABS.length; i++) if (TABS[i].id == findid) return TABS[i];
  }

  openTab(evt, tabId) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    let T = this.findTabByID(tabId);
    document.getElementById(T.divname).style.display = 'block';
    evt.currentTarget.className += ' active';
    this.MainViewName = T.caption;
  }

  public validateNewTask = (t: MCUXObject) => {
    return t.description != '';
  };

  public highlightTask = (t: MCUXObject) => {
    return (t as TaskObj).dueTask();
  };

  typeStr(o: MCFieldType): string {
    switch (o) {
      case MCFieldType.MCFTobjid:
        return 'objid';
      case MCFieldType.MCFTboolean:
        return 'boolean';
      case MCFieldType.MCFTnumber:
        return 'number';
      case MCFieldType.MCFTstring:
        return 'string';
      case MCFieldType.MCFTdate:
        return 'date';
      case MCFieldType.MCFTstatus:
        return 'status';
      case MCFieldType.MCFTuser:
        return 'user';
    }
  }
}

@Component({
  selector: 'task-properties',
  templateUrl: './task-properties.html'
})
export class TaskProperties implements OnInit {
  @Input() set Parameters(o: object) {
    if (typeof o === 'undefined') this.disabled = true;
    else {
      this.disabled = o['disabled'];
      let s = o['oneSelected'];
      this.toDueDate = s == null ? null : (s as TaskObj).dueDate;
    }
  }
  @Output() dueDate = new EventEmitter<Date>();

  toDueDate: Date = new Date();
  disabled: boolean = false;

  ngOnInit() {}

  /*
  ngOnChanges(changes: SimpleChanges): void {
    console.log ("por aqu??");
    let change = changes['Parameters'];
    this.disabled = change.currentValue['disabled'];
  }
*/
}

/// CAMPOS DE LA BBDD

export var TaskDBFields: MCDBField[] = [
  new MCDBField(
    1,
    'id',
    'Task ID',
    MCFieldType.MCFTobjid,
    MCObject.getObjid(10, 1),
    false,
    'ro',
    100,
    null,
    'mandatory',
    100,
    ''
  ),
  new MCDBField(
    2,
    'name',
    'Task',
    MCFieldType.MCFTstring,
    MCObject.getObjid(10, 1),
    true,
    'rw',
    120,
    '',
    'mandatory',
    120,
    'Enter task name here'
  ),
  new MCDBField(
    3,
    'owner',
    'Assigned to',
    MCFieldType.MCFTuser,
    MCObject.getObjid(10, 1),
    true,
    'rw',
    80,
    UserList[currentUser],
    'mandatory',
    80,
    ''
  ),
  new MCDBField(
    4,
    'creator',
    'Reporter',
    MCFieldType.MCFTuser,
    MCObject.getObjid(10, 1),
    true,
    'ro',
    80,
    UserList[currentUser],
    'mandatory',
    80,
    UserList[currentUser]
  ),
  new MCDBField(
    5,
    'status',
    'Status',
    MCFieldType.MCFTstatus,
    MCObject.getObjid(10, 1),
    true,
    'ro',
    80,
    0,
    'mandatory',
    80,
    '--' + basicFlow[0].name + '--'
  ),
  new MCDBField(
    6,
    'createdT',
    'Created at',
    MCFieldType.MCFTdate,
    MCObject.getObjid(10, 1),
    true,
    'ro',
    90,
    'now',
    'mandatory',
    90,
    'now'
    //    NewRecordCaption: formatDate(new Date(), 'yyyy/MM/dd', 'en')
  ),
  new MCDBField(
    7,
    'resolvedT',
    'Resolved at',
    MCFieldType.MCFTdate,
    MCObject.getObjid(10, 1),
    true,
    'ro',
    90,
    null,
    'optional',
    90,
    ''
  ),
  new MCDBField(
    8,
    'DueDate',
    'Due by',
    MCFieldType.MCFTdate,
    MCObject.getObjid(10, 1),
    true,
    'rw',
    125,
    new Date('2020-01-01'),
    'mandatory',
    125,
    ''
  ),
  new MCDBField(
    9,
    'closedT',
    'Closed at',
    MCFieldType.MCFTdate,
    MCObject.getObjid(10, 1),
    false,
    'ro',
    90,
    null,
    'optional',
    90,
    ''
  ),
  new MCDBField(
    10,
    'description',
    'Description',
    MCFieldType.MCFTstring,
    MCObject.getObjid(10, 1),
    true,
    'rw',
    280,
    '',
    'optional',
    0,
    'Enter task description'
  )
];
