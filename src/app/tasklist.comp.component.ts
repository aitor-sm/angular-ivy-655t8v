import {
  Component,
  Input,
  OnInit,
  Inject,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef
} from '@angular/core';

import {
  MCField,
  UserList,
  currentUser,
  MCObject,
  MCUXObject, MCUXList
} from './MC.core';
import { basicFlow, FlowActionObj, FlowStatusObj } from './flows';
import { TabObj } from './app.component';


export interface MCDBField extends MCField {
  Show: boolean;
  Access: 'ro' | 'rw';
  Width: number;
  MinWidth: number;
  NewRecordCaption: string;
}

const ToolbarTABS: TabObj[] = [
  { id: '10', divname: 'DBProps', caption: 'Database' },
  { id: '11', divname: 'DBRecProps', caption: 'Record' },
  { id: '12', divname: 'ViewProps', caption: 'View' }
];

@Component({
  selector: 'tasklist_comp',
  templateUrl: './tasklist.comp.component.html',
  styleUrls: ['./tasklist.comp.component.css']
})
export class TaskList_comp implements OnInit {
  @Input() Parameters: object;
//  @Input() ObjectList: MCUXList;

  @Output() FinishRender = new EventEmitter<boolean>();
  @Output() RecPropOutput = new EventEmitter<object>();
  @Output() AddRecordCallBack = new EventEmitter<MCUXObject>();
  @Output() DeleteRecordCallBack = new EventEmitter<number>();

  @ViewChild('RecordSpecificProps', { read: ViewContainerRef }) RecPropContainer;

//  protected validateNewRecord: (t: MCUXObject) => boolean;
//  highlightRecord: (t: MCUXObject) => boolean;
//  protected ClassID: number = 100; // NO! debe venir de propiedades

  ///////////////// PROPERTIES

//  factory: ComponentFactory<TaskProperties>;
  RecordPropsComponentRef: ComponentRef<any>;

  RecordPropParams: object;

  TL: MCUXList;

  // Visual components
  focus: MCUXObject; // Focused task
  sel: MCUXObject;

  // Controls for new task
  newRecordToggle: boolean = false;
  newTask: MCUXObject; // Template for new Task
//  newTask: TaskObj; // Template for new Task
 
  // Object properties specific
  op_classname: string = '';
  op_name: string = '';
  op_owner: number = -1;
  op_creator: number = -1;
  op_createdT: Date;
  op_resolvedT: Date;
  op_closedT: Date;
  op_status: number;
  op_description: string;
//  toDueDate: Date = new Date();

  // View options
  fields: MCDBField[] = TaskDBFields;
  vw_showTerminalTasks: boolean = true;
  vw_showHeaders: boolean = true;
  vw_showGrid: boolean = false;

  ///////////////// CONSTRUCTORS

  ngOnInit() {

    // OJO que esto no va a funcionar
    let p = {
      initSelect: this.Parameters['initSelect']
    };

    this.TL = new MCUXList(p);
    // end_OJO

/*
    this.TL.addNewItem (new TaskObj ("Programa Tasks", 0, "Crear la versión 0.4", 0, new Date('2021-08-21')));
    this.TL.addNewItem (new TaskObj ("Clase alemán", 1, "Clase por la tarde", 1, new Date('2021-08-21')));
    this.TL.addNewItem (new TaskObj ("Deberes", 0, "Descripción 3", 2, new Date('2021-08-21')));
*/


//    this.obj_l.push (new MCUXObject (100, "Deberes", 0, "Descripción 3", 2));

//    this.TL = this.ObjectList;

    this.selectedSummary(null);

//    this.validateNewRecord = this.TL.validateNewTask;
//    this.highlightRecord = this.TL.highlightTask;

    document.getElementById(this.Parameters['initToolbar']).click();


    this.RecordPropParams = {
      disabled:    true,
      oneSelected: null

    };

  }

  ngAfterViewInit() {
    setTimeout(() => {
//      this.factory = this.resolver.resolveComponentFactory(TaskProperties);

      let factory = this.Parameters["RecPropFactory"];

      this.RecordPropsComponentRef = this.RecPropContainer.createComponent(
        factory
      );

      this.updateCustomProperties ();
/*
      this.RecordPropsComponentRef.instance.dueDate.subscribe(d => {console.log (typeof d)
        console.log(d);
        let D = new Date (d);
        console.log(D);
        this.changeDueDateOnSelectedTasks(D);
      });
*/
//      this.RecordPropsComponentRef.instance.dueDate.subscribe(d => {console.log ("D1=",d);this.RecPropOutput.emit(new Date(d))});
      this.RecordPropsComponentRef.instance.dueDate.subscribe(d => {this.RecPropOutput.emit(new Date(d))});

/*
      this.RecordPropParams['disabled'] = this.numSelected() == 0;

      this.RecordPropsComponentRef.instance.Parameters = this.RecordPropParams;
*/
      this.FinishRender.emit(true);
      this.TL.bulkSelect(this.Parameters['initSelect']);
      this.selectedSummary(null);

    });
  }

  constructor(
     ) {}

  ///////////////// GENERAL UTILITY

  numSelected(): number {
    return this.TL.countSelIf(this.applyFilter);
  }

  numFiltered(): number {
    return this.TL.countIf(this.applyFilter);
  }

  getFilteredRecords(): MCUXObject[] {
    return this.TL.subFilter(this.applyFilter);
  }

  ///////////////// VISUAL EFFECTS

  visibleFields(): MCDBField[] {
    return this.fields.filter(t => {
      return t.Show;
    });
  }

  vw_toggleTerminalTasks(e) {
    //    const checkbox = e.target as HTMLInputElement;

    //    this.vw_showTerminalTasks = checkbox.checked;

    if (!this.vw_showTerminalTasks)
      this.TL.doSel(t => {
        if (t.isTerminalStatus()) t.selected = false;
      });
  }

  public applyFilter = t => {
    return this.vw_showTerminalTasks || !t.isTerminalStatus();
  };

  onMouseOver(t: MCUXObject): void {
    this.focus = t;
  }

  onMouseOut(t: MCUXObject): void {
    this.focus = null;
  }

  onChangeOwner() {
    this.reassignSelectedTasks(this.op_owner);
  }

  commonAvailableActions(): FlowActionObj[] {
    if (this.op_status >= 0) return basicFlow[this.op_status].actions;
    else return null;
  }

  /*
  getStatusBarMessage () : string {
    if (typeof this.Parameters["statusBarMsg"]() !== "undefined")
    return this.Parameters["statusBarMsg"]()
    else
    return "Loading..."
  }
*/

  updateCustomProperties () {
    this.RecordPropParams['disabled'] = this.numSelected() == 0;

    if (this.checkOneSelectedTask())
      this.RecordPropParams['oneSelected'] = this.sel;
    else
      this.RecordPropParams['oneSelected'] = null;

    this.RecordPropsComponentRef.instance.Parameters = this.RecordPropParams;

    // NgOnChange will not get this well unless we do this
    /*
    let clone =  { ...this.RecordPropParams };
    clone["disabled"]= this.numSelected()==0;
    this.RecordPropParams = clone;
    this.RecordPropsComponentRef.instance.Parameters=clone;
*/

  }

  onSelectRecord(e: Event, r: MCUXObject) {
    const checkbox = e.target as HTMLInputElement;

    r.selected = checkbox.checked;

    if (r.selected && this.numSelected() == 1) this.selectedSummary(r);
    else this.selectedSummary(null);

    this.updateCustomProperties ();

  }

  onSelectAll(e: Event): void {
    const checkbox = e.target as HTMLInputElement;

    this.TL.doIf(t => (t.selected = checkbox.checked), this.applyFilter);
  }

  toggleNewRecordBar() {
    this.newRecordToggle = !this.newRecordToggle;
    if (this.newRecordToggle) this.createNewRecordTemplate(true);
  }

  createNewRecordTemplate(clearFields: boolean) {
    /*
    if (clearFields || typeof(this.newTask) == "undefined") {
      this.newTask = new MCUXObject (this.ClassID, "",this.Parameters["currentUser"],"", 0);
    }
    else
      this.newTask = (this.newTask.clone() as TaskObj);
*/

/*
    if (clearFields)  {
      this.newTask = new TaskObj('', this.Parameters['currentUser'], '', 0, null);
      return;      
    }


  if (clearFields ||
      (typeof this.newTask == 'undefined')) {
      this.newTask = new TaskObj('', this.Parameters['currentUser'], '', 0, null);
    }
  else 
      this.newTask = (this.newTask as MCUXObject).clone() as TaskObj;

  return;
*/

/*
    let d: Date =
      !clearFields &&
      typeof this.newTask != 'undefined' &&
      typeof this.newTask.dueDate != 'undefined' &&
      this.newTask.dueDate != null
        ? new Date(this.newTask.dueDate)
        : null;
*/

    //    this.newTask = new TaskObj ("",this.Parameters["currentUser"],"", 0, new Date("2020-01-01") );

/*
    if (typeof this.newTask != 'undefined') {
    let e = (this.newTask as MCUXObject).clone();
    }
*/


    if (clearFields)
//      this.newTask = new TaskObj('', this.Parameters['currentUser'], '', 0, null);
      this.newTask = new MCUXObject(this.Parameters["RecClassId"],'', this.Parameters['currentUser'], '', 0);

/*
    else 
//      this.newTask = this.newTask.clone();

      this.newTask = new TaskObj(
        this.newTask.name,
        this.newTask.owner,
        this.newTask.description,
        0,
        d
      );
*/
  }


  isValidNewRecord(): boolean {
    return (
      this.newTask.validateNewObject() && this.Parameters["validateNewRecord"](this.newTask)
//      this.newTask.validateNewObject() && this.validateNewRecord(this.newTask)
    );

    //    return this.newTask.name != "" && this.newTask.description != "";
  }

  findTabByID(findid: string): TabObj {
    let i: number;
    for (i = 0; i < ToolbarTABS.length; i++)
      if (ToolbarTABS[i].id == findid) return ToolbarTABS[i];
  }

  writeDateField(t: MCUXObject, fieldName: string, d: any) {
    //    console.log ("XX ", d, "|", typeof d);
    t.setFieldValue(fieldName, new Date(d));
  }

  openToolbarTab(evt, tabId) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName('toolbartabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('toolbar_tab');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    let T = this.findTabByID(tabId);
    document.getElementById(T.divname).style.display = 'block';
    evt.currentTarget.className += ' active';
  }

  ///////////////// WINDOWS CONTROLS

  /* Update the property fields depending on selected items;
  if an item is given, it replaces properties depending on it */
  selectedSummary(r: MCUXObject | null) {
    let k: MCUXObject = null;
    let l = this.TL.selected();

    if (l.length == 0) {
      this.op_classname = 'none';
      this.op_name = '';
      this.op_owner = -1;
      this.op_creator = -1;
      this.op_createdT = null;
      this.op_resolvedT = null;
      this.op_closedT = null;
      this.op_status = -1;
      this.op_description = '';

//      this.toDueDate = new Date('2020-01-01');

      return;
    }

    if (r !== undefined && r !== null) {
      k = r;
    } else if (l.length == 1) {
      k = l[0];
    }

    if (k !== null) {
      this.op_classname = k.getClassName();
      this.op_name = k.name;
      this.op_owner = k.owner;
      this.op_creator = k.creator;
      this.op_createdT = k.created;
//      this.toDueDate = (k as TaskObj).dueDate;
      this.op_resolvedT = k.resolvedT;
      this.op_closedT = k.closedT;
      this.op_status = k.status;
      this.op_description = k.description;
    } else {
      //      let o = {};

      if (l.length > 0) {
        //        console.log ("ll=", l.length);

        /* class names */
        let s: Set<any>;

        s = l.reduce((p, c) => p.add(c.name), new Set());
        if (s.size > 1) this.op_name = '';
        else this.op_name = s.entries().next().value[0];

        s = l.reduce((p, c) => p.add(c.creator), new Set());
        if (s.size > 1) this.op_creator = -1;
        else this.op_creator = s.entries().next().value[0];

        s = l.reduce((p, c) => p.add(c.created), new Set());
        if (s.size > 1) this.op_createdT = null;
        else this.op_createdT = s.entries().next().value[0];

        s = l.reduce((p, c) => p.add(c.getClassName()), new Set());
        if (s.size > 1) this.op_classname = 'several';
        else this.op_classname = s.entries().next().value[0];

        s = l.reduce((p, c) => p.add(c.owner), new Set());
        if (s.size > 1) this.op_owner = -1;
        else this.op_owner = s.entries().next().value[0];

        s = l.reduce((p, c) => p.add(c.status), new Set());
        if (s.size > 1) this.op_status = -1;
        else this.op_status = s.entries().next().value[0];

        s = l.reduce((p, c) => p.add(c.description), new Set());
        if (s.size > 1) this.op_description = '';
        else this.op_description = s.entries().next().value[0];
/*
        s = l.reduce((p, c) => p.add((c as TaskObj).dueDate), new Set());
        if (s.size > 1) this.toDueDate = null;
        else this.toDueDate = s.entries().next().value[0];
*/
        this.op_resolvedT = null;
        this.op_closedT = null;

        /*
        s = l.reduce ((p,c) => (p.add(c.getClassName())),new Set());
        if (s.size > 1) o["ClassName"] = "*";
        else  o["ClassName"] = s.entries().next().value[0];

        s = l.reduce ((p,c) => (p.add(c.owner)),new Set());
        if (s.size > 1) o["Owner"] = "*";
        else  o["Owner"] = s.entries().next().value[0];

        s = l.reduce ((p,c) => (p.add((c as TaskObj).dueDate)),new Set());
        if (s.size > 1) o["DueDate"] = "*";
        else  o["DueDate"] = s.entries().next().value[0];
*/
      }
      //      console.log ("o=",o);
    }
  }

  getSelectedStatusName(): string {
    if (this.op_status == -1) return '-';
    else return basicFlow[this.op_status].name;
  }

  addRecord (o: MCUXObject) {
    this.TL.addNewItem(o);
  }

  addNewTaskButton() {
    //    let I = this.newTask;

//      this.addRecord (this.newTask);

      this.AddRecordCallBack.emit (this.newTask);
//    this.TL.addNewItem(this.newTask);

//    this.createNewRecordTemplate(false);
    /*
    this.newTask.name = I.name;
    this.newTask.description = I.description;
    this.newTask.owner = I.owner;
*/

    // Se está copiando el X-Fields!
    /*
  console.log (I.getXField("DueDate"));
  console.log (this.newTask.getXField("DueDate"));
  console.log (I.getXField("DueDate") == this.newTask.getXField("DueDate"));
  console.log (I.getXField("DueDate") === this.newTask.getXField("DueDate"));
*/
  }

  deleteSelectedTasksButton(o: number): void {


    this.DeleteRecordCallBack.emit(o);

  }




  // MÁS MÉTODOS INTERNOS

  doDeleteTasks(o: number): void {
    switch (o) {
      case 0 /* Focused */:
        this.TL.splice(this.TL.indexOf(this.focus), 1);
        break;
      case 1 /* All selected */:
        this.TL.deleteSel();
        break;
    }
  }

  doActionTasks(newStatus: number) {
    this.TL.doSel(t => (t.status = newStatus));
    this.selectedSummary(null);
  }

  reassignSelectedTasks(assignee: number) {
    this.TL.doSel(t => (t.owner = assignee));
  }

  renameSelectedTasks() {
    this.TL.doSel(t => (t.name = this.op_name));
  }

  public executeOnSelectedRecords(e: (arg0: MCUXObject) => void) {
    this.TL.doSel(e);
  }

  ///////////////// TASK SPECIFIC METHODS

/*
  changeDueDateOnSelectedTasks(d: Date) {
//    this.TL.doSel(t => (t.dueDate = new Date(this.toDueDate)));
    this.TL.doSel(t => (t.dueDate = new Date(d)));
  }
*/

  checkOneSelectedTask(): boolean {
    if (this.TL.countSelIf(this.applyFilter) == 1) {
      this.sel = this.TL.selected()[0];
      return true;
    } else {
      this.sel = null;
      return false;
    }
  }

  /*
  f : Function = (t: MCUXObject) : boolean => {
    return this.applyFilter(t);
  }
*/
  /*
  // Se usa para la barra de estados
  numDueTasks(): number {
      return this.TL.countIf (t => (this.applyFilter(t) && (t as TaskObj).dueTask()));
  }
*/
  /*
  getDueDate (t): Date {
    return (t as TaskObj).dueDate;
  }
*/

  /*
  // Se usa para el highlight
  isDueTask (t): boolean {
    return (t as TaskObj).dueTask();
  }
*/
}




/// CAMPOS DE LA BBDD

export var TaskDBFields: MCDBField[] = [
  {
    FName: 'id',
    FCaption: 'Task ID',
    FType: 'objid',
    Show: false,
    Access: 'ro',
    Width: 100,
    Default: null,
    FOptionality: 'mandatory',
    MinWidth: 100,
    NewRecordCaption: ''
  },
  {
    FName: 'name',
    FCaption: 'Task',
    FType: 'string',
    Show: true,
    Access: 'rw',
    Width: 120,
    Default: '',
    FOptionality: 'mandatory',
    MinWidth: 120,
    NewRecordCaption: 'Enter task name here'
  },
  {
    FName: 'owner',
    FCaption: 'Assigned to',
    FType: 'user',
    Show: true,
    Access: 'rw',
    Width: 80,
    Default: UserList[currentUser],
    FOptionality: 'mandatory',
    MinWidth: 80,
    NewRecordCaption: ''
  },
  {
    FName: 'creator',
    FCaption: 'Reporter',
    FType: 'user',
    Show: true,
    Access: 'ro',
    Width: 80,
    Default: UserList[currentUser],
    FOptionality: 'mandatory',
    MinWidth: 80,
    NewRecordCaption: UserList[currentUser]
  },
  {
    FName: 'status',
    FCaption: 'Status',
    FType: 'status',
    Show: true,
    Access: 'ro',
    Width: 80,
    Default: 0,
    FOptionality: 'mandatory',
    MinWidth: 80,
    NewRecordCaption: '--' + basicFlow[0].name + '--'
  },
  {
    FName: 'createdT',
    FCaption: 'Created at',
    FType: 'date',
    Show: true,
    Access: 'ro',
    Width: 90,
    Default: 'now',
    FOptionality: 'mandatory',
    MinWidth: 90,
    NewRecordCaption: 'now'
    //    NewRecordCaption: formatDate(new Date(), 'yyyy/MM/dd', 'en')
  },
  {
    FName: 'resolvedT',
    FCaption: 'Resolved at',
    FType: 'date',
    Show: true,
    Access: 'ro',
    Width: 90,
    Default: null,
    FOptionality: 'optional',
    MinWidth: 90,
    NewRecordCaption: ''
  },
  {
    FName: 'DueDate',
    FCaption: 'Due by',
    FType: 'date',
    Show: true,
    Access: 'rw',
    Width: 125,
    Default: new Date('2020-01-01'),
    FOptionality: 'mandatory',
    MinWidth: 125,
    NewRecordCaption: ''
  },
  {
    FName: 'closedT',
    FCaption: 'Closed at',
    FType: 'date',
    Show: false,
    Access: 'ro',
    Width: 90,
    Default: null,
    FOptionality: 'optional',
    MinWidth: 90,
    NewRecordCaption: ''
  },
  {
    FName: 'description',
    FCaption: 'Description',
    FType: 'string',
    Show: true,
    Access: 'rw',
    Width: 280,
    Default: '',
    FOptionality: 'optional',
    MinWidth: 0,
    NewRecordCaption: 'Enter task description'
  }
];
