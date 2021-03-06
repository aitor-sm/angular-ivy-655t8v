import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';

import { MCField, MCUXObject, MCUXList, MCObject, MCFieldType, currentUser } from './MC.core';
import { basicFlow, FlowActionObj, FlowStatusObj } from './flows';
import { TabObj } from './app.component';
import { NCobjectS } from './NCobject.service';


export class MCDBField extends MCUXObject implements MCField {
//export interface MCDBField extends MCField {
//  ParentView: string;
//  Show: boolean;
//  Access: 'ro' | 'rw';
//  Width: number;
//  MinWidth: number;
//  NewRecordCaption: string;
//  Default: any;
//  FOptionality: "optional" | "mandatory";

/*
  _ParentView: string;
  _Show: boolean;
  _Access: 'ro' | 'rw';
  _Width: number;
  _MinWidth: number;
  _NewRecordCaption: string;
  _Default: any;
  _FOptionality: "optional" | "mandatory";
*/

  public get ParentView () : string {
    return this.getXField ("ParentView");
  }

  public set ParentView (s: string) {
    this.setXField ("ParentView", s);
  }

  public get Show () : boolean {
    return this.getXField ("Show");
  }

  public set Show (s: boolean) {
    this.setXField ("Show", s);
  }

  public get Access () : 'ro' | 'rw' {
    return this.getXField ("Access");
  }

  public set Access (s: 'ro' | 'rw') {
    this.setXField ("Access", s);
  }

  public get Width () : number {
    return this.getXField ("Width");
  }

  public set Width (s: number) {
    this.setXField ("Width", s);
  }

  public get MinWidth () : number {
    return this.getXField ("MinWidth");
  }

  public set MinWidth (s: number) {
    this.setXField ("MinWidth",  s);
  }

  public get NewRecordCaption () : string {
    return this.getXField ("NewRecordCaption");
  }

  public set NewRecordCaption (s: string) {
    this.setXField ("NewRecordCaption", s);
  }

  public get Default () : any {
    return this.getXField ("Default");
  }

  public set Default (s: any) {
    this.setXField ("Default",  s);
  }

  public get FOptionality () : "optional" | "mandatory" {
    return this.getXField ("FOptionality");
  }

  public set FOptionality (s: "optional" | "mandatory") {
    this.setXField ("FOptionality",  s);
  }








  constructor (oid: number, name: string, description: string, type: MCFieldType, parentView: string, show: boolean, access: 'ro' | 'rw', width: number, Default: any, foptionality: "optional" | "mandatory", minwidth: number, newRecCaption: string) {
  
    super( 11, oid, type, name, currentUser, description, 0, {} );
    this.ParentView = parentView;
    this.Show = show;
    this.Access = access;
    this.Width = width;
    this.Default = Default;
    this.FOptionality = foptionality;
    this.MinWidth = minwidth;
    this.NewRecordCaption = newRecCaption

  }

/*
      name: 'id',
    description: 'Task ID',
    type: MCFieldType.MCFTobjid,
    Show: false,
    Access: 'ro',
    Width: 100,
    Default: null,
    FOptionality: 'mandatory',
    MinWidth: 100,
    NewRecordCaption: ''
*/
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
  @Input() fields: MCDBField[];
  @Input() currentView: DBViewObject;

  @Output() FinishRender = new EventEmitter<boolean>();
  @Output() RecPropOutput = new EventEmitter<object>();
  @Output() AddRecordCallBack = new EventEmitter<MCUXObject>();
  @Output() DeleteRecordCallBack = new EventEmitter<number>();

  @ViewChild('RecordSpecificProps', { read: ViewContainerRef }) RecPropContainer;

  ///////////////// PROPERTIES

  RecordPropsComponentRef: ComponentRef<any>;

  RecordPropParams: object = {
      disabled:    true,
      oneSelected: null
    };

  TL: MCUXList;

  // Visual components
  focus:   MCUXObject; // Focused record (mouse)
  sel:     MCUXObject; // Selected record (when one selected)
  newRec:  MCUXObject; // Template for new record

  // Controls for new task
  newRecordToggle: boolean = false;
 
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

  // Sorting options (temporary)
//  ascending : boolean = true;
//  sortField : number  = 1;


  ///////////////// INITIALISATION

  ngOnInit() {

    this.TL = new MCUXList({});
    this.selectedSummary(null);

    document.getElementById(this.Parameters['initToolbar']).click();

  }

  ngAfterViewInit() {
    setTimeout(() => {

      // Prepare the specific record properties dialog
      this.RecordPropsComponentRef = this.RecPropContainer.createComponent( this.Parameters["RecPropFactory"] );
      this.RecordPropsComponentRef.instance.dueDate.subscribe(d => {this.RecPropOutput.emit(new Date(d))});

      // Notify parent, rendered and ready to accept records
      this.FinishRender.emit(true);

      // Actions once records have loaded
      this.TL.bulkSelect(this.Parameters['initSelect']);
      this.selectedSummary(null);

      this.updateCustomProperties ();

    });
  }

  constructor() {}

  ///////////////// PUBLIC METHODS TO BE USED OUTSIDE

  // Record Set

  public numSelected(): number {
    return this.TL.countSelIf(this.applyFilter);
  }

  public numFiltered(): number {
    return this.TL.countIf(this.applyFilter);
  }

  public getFilteredRecords(): MCUXObject[] {
    return this.TL.subFilter(this.applyFilter);
  }

  // View
  public visibleFields(): MCDBField[] {
    return this.fields.filter(t => {
      return t.Show;
    });
  }



  ///////////////// TEMPLATE UI METHODS

  // Table
  onMouseOver(t: MCUXObject): void {
    this.focus = t;
  }

  onMouseOut(t: MCUXObject): void {
    this.focus = null;
  }

  // View
  vw_toggleTerminalTasks(e) {
    if (!this.currentView.showTerminal )
      this.TL.doSel(t => {
        if (t.isTerminalStatus()) t.selected = false;
      });
  }

  showArrow (name: string): string {
    if (name == (this.fields[this.currentView.sortField].name))
      return this.currentView.ascending ? '???' : '???';
    else
      return "";
  }

  sortByThisField ( name: string) {
//    console.log ("name=",name);
    if (name == (this.fields[this.currentView.sortField].name)) 
      this.currentView.ascending = !this.currentView.ascending;
    else {
      this.currentView.ascending = true;
      for (let i=this.fields.length-1; i>=0; i--) {
        if (name == (this.fields[i].name))
          this.currentView.sortField = i;
      }
    }
//    console.log ("sortfield=",this.currentView.sortField);
//    console.log ("ascending=",this.currentView.ascending);
  }


  ///////////////// PRIVATE METHODS





  ///////////////// VISUAL EFFECTS



  applyFilter = t => {
    return this.currentView.showTerminal || !t.isTerminalStatus();
  };


  onChangeOwner() {
    this.reassignSelectedTasks(this.op_owner);
  }

  commonAvailableActions(): FlowActionObj[] {
    if (this.op_status >= 0) return basicFlow[this.op_status].actions;
    else return null;
  }

  updateCustomProperties () {
    this.RecordPropParams['disabled'] = this.numSelected() == 0;

    if (this.checkOneSelectedTask())
      this.RecordPropParams['oneSelected'] = this.sel;
    else
      this.RecordPropParams['oneSelected'] = null;

    this.RecordPropsComponentRef.instance.Parameters = this.RecordPropParams;

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
    if (this.newRecordToggle) this.createNewRecordTemplate();
  }

  createNewRecordTemplate() {
    this.newRec = new MCUXObject(this.Parameters["RecClassId"],0, 0, '', this.Parameters['currentUser'], '', 0, {});
  }


  isValidNewRecord(): boolean {
    return (
      this.newRec.validateNewObject() && this.Parameters["validateNewRecord"](this.newRec)
    );
  }

  private findTabByID(findid: string): TabObj {
    let i: number;
    for (i = 0; i < ToolbarTABS.length; i++)
      if (ToolbarTABS[i].id == findid) return ToolbarTABS[i];
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
      this.op_classname = MCObject.getClassName(k.getFieldValue("class#"));
      this.op_name = k.name;
      this.op_owner = k.owner;
      this.op_creator = k.creator;
      this.op_createdT = k.created;
      this.op_resolvedT = k.resolvedT;
      this.op_closedT = k.closedT;
      this.op_status = k.status;
      this.op_description = k.description;
    } else {

      if (l.length > 0) {

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

        s = l.reduce((p, c) => p.add(MCObject.getClassName( c.getFieldValue("class#"))), new Set());
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

        s = l.reduce((p, c) => p.add(c.resolvedT), new Set());
        if (s.size > 1) this.op_resolvedT = null;
        else this.op_resolvedT = s.entries().next().value[0];

        s = l.reduce((p, c) => p.add(c.closedT), new Set());
        if (s.size > 1) this.op_closedT = null;
        else this.op_closedT = s.entries().next().value[0];

        /*
          PENDING: actor who resolved, actor who closed
        */

      }
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
      this.AddRecordCallBack.emit (this.newRec);
  }

  deleteSelectedTasksButton(o: number): void {
    this.DeleteRecordCallBack.emit(o);
  }




  // M??S M??TODOS INTERNOS

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

  checkOneSelectedTask(): boolean {
    if (this.TL.countSelIf(this.applyFilter) == 1) {
      this.sel = this.TL.selected()[0];
      return true;
    } else {
      this.sel = null;
      return false;
    }
  }

    typeStr (o: MCFieldType): string {
    switch (o) {
      case  MCFieldType.MCFTobjid:   return "objid";
      case  MCFieldType.MCFTboolean: return "boolean";
      case  MCFieldType.MCFTnumber:  return "number";
      case  MCFieldType.MCFTstring:  return "string";
      case  MCFieldType.MCFTdate:    return "date";
      case  MCFieldType.MCFTstatus:  return "status";
      case  MCFieldType.MCFTuser:    return "user";
    }
  }


}







export class DBViewObject extends MCObject {

    constructor (o: MCObject) {
      super(o.getFieldValue("class#"), o.nid, o.type, o.name, o.owner, o.description, o.status, o._XFields);
//      this._XFields = o._XFields;

      /*
      this.showHeaders = o.getXField ("showHeaders");
      this.showGrid = o.getXField ("showGrid");
      this.showTerminal = o.getXField ("showTerminal");
      */
    }

    public get showTerminal () : boolean {
      return this.getXField ("showTerminal");
    }

    public set showTerminal (b: boolean) {
      this.setXField ("showTerminal", b);
    }

    public get showGrid () : boolean {
      return this.getXField ("showGrid");
    }

    public set showGrid (b: boolean) {
      this.setXField ("showGrid", b);
    }

    public get showHeaders () : boolean {
      return this.getXField ("showHeaders");
    }

    public set showHeaders (b: boolean) {
      this.setXField ("showHeaders", b);
    }

    public get sortField () : number {
      return this.getXField ("sortField");
    }

    public set sortField (b: number) {
      this.setXField ("sortField", b);
    }
    public get ascending () : boolean {
      return this.getXField ("ascending");
    }

    public set ascending (b: boolean) {
      this.setXField ("ascending", b);
    }


}
