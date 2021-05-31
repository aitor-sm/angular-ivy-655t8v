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

import { MCField, MCUXObject, MCUXList, MCObject } from './MC.core';
import { basicFlow, FlowActionObj, FlowStatusObj } from './flows';
import { TabObj } from './app.component';
import { NCobjectS } from './NCobject.service';


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
    if (name == (this.fields[this.currentView.sortField].FName))
      return this.currentView.ascending ? '▲' : '▼';
    else
      return "";
  }

  sortByThisField ( name: string) {
//    console.log ("name=",name);
    if (name == (this.fields[this.currentView.sortField].FName)) 
      this.currentView.ascending = !this.currentView.ascending;
    else {
      this.currentView.ascending = true;
      for (let i=this.fields.length-1; i>=0; i--) {
        if (name == (this.fields[i].FName))
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
    this.newRec = new MCUXObject(this.Parameters["RecClassId"],0, '', this.Parameters['currentUser'], '', 0);
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
      this.op_classname = k.getClassName();
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

        this.op_resolvedT = null;
        this.op_closedT = null;

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

  checkOneSelectedTask(): boolean {
    if (this.TL.countSelIf(this.applyFilter) == 1) {
      this.sel = this.TL.selected()[0];
      return true;
    } else {
      this.sel = null;
      return false;
    }
  }

}







export class DBViewObject extends MCObject {

    constructor (o: MCObject) {
      super(o.nid, o.type, o.name, o.owner, o.description, o.status);
      this._XFields = o._XFields;

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
