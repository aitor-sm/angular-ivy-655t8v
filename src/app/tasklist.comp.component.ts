import { Component, Input, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { TaskObj, TaskList, TasksCfg } from "./tasks";

export interface DeleteDialogData {
  numberOfTasks: number;
  confirmation: boolean;
  doIt: boolean;
}


@Component({
  selector: "tasklist_comp",
  templateUrl: "./tasklist.comp.component.html",
  styleUrls: ["./tasklist.comp.component.css"]
})


export class TaskList_comp implements OnInit {
  @Input() Parameters: object;

  ///////////////// PROPERTIES

  // To TaskList
//  task_l: TaskObj[] =[];

  // To DBList
  focus: TaskObj;

  // From this class
  reassignTo: number = 0;
  toDueDate: Date = new Date();

  newTaskToggle: boolean = false;

  newTask: TaskObj;

  TL : TaskList;

 

  ///////////////// CONSTRUCTOR

  ngOnInit() {

    let p = { 
      initSelect : this.Parameters["initSelect"]
    };

    this.TL = new TaskList(p);

  }

  constructor (public DeleteTasksDialog: MatDialog) {}


  ///////////////// TASK-LIST METHODS
/*
  retrieveTasks ()  {
    
    this.TL.task_l.push (new TaskObj ("Programa Tasks", 0, "Crear la versión 0.4", 0, new Date('2021-04-21')));
    this.TL.task_l.push (new TaskObj ("Clase alemán", 1, "Clase por la tarde", 1, new Date('2021-04-21')));
    this.TL.task_l.push (new TaskObj ("Deberes", 0, "Descripción 3", 2, new Date('2021-04-21')));

  }
*/

/*

  deleteTask(t: TaskObj) {
    for (let i = this.TL.task_l.length - 1; i >= 0; i--)
      if (this.TL.task_l[i] == this.focus) {
        this.TL.task_l.splice(i, 1);
        break;
      }
  }
*/

  numTotalTasks(): number {
      return this.TL.countIf (this.applyFilter);
//    return this.TL.task_l.filter(x => this.applyFilter(x)).length;
  }


  numDueTasks(): number {
      return this.TL.countIf (t => (this.applyFilter(t) && t.dueTask()));
//    return this.TL.task_l.filter(t => t.dueTask()).length;
  }

/*
  addNewTask(task: TaskObj) {
    this.TL.addNewTask(task);
//    this.TL.task_l.push(task);
  }
*/

  ///////////////// DB.VIEWER METHODS

  applyFilter (t: TaskObj): boolean {
    return true;
  }

  addNewTaskButton () {
    let I = this.newTask;
    
    this.TL.addNewTask (this.newTask);
    this.createNewTaskTemplate ();
    Object.assign (this.newTask, I);
  }

  onMouseOver(t: TaskObj): void {
    this.focus = t;
  }

  onMouseOut(t: TaskObj): void {
    this.focus = null;
  }

  onSelectAll(e: Event): void {
    const checkbox = e.target as HTMLInputElement;

    this.TL.doIf ( t => t.selected = checkbox.checked,
                   this.applyFilter );

//    this.TL.task_l.forEach(t => (this.applyFilter(t) && (t.selected = checkbox.checked)));
//    for (let i = this.task_l.length - 1; i >= 0; i--) {
//      this.task_l[i].selected = checkbox.checked;
//    }
  }

  doDeleteTasks(o: number): void {

    switch (o) {
      case 0:   /* Focused */
        this.TL.splice(this.TL.indexOf(this.focus),1);
      case 1:  /* All selected */
        this.TL.deleteSel();
//        this.TL.task_l = this.TL.task_l.reduce((p,c) => (!c.selected && p.push(c),p),[]);
        break;
    }

      

//      for (let i = this.task_l.length - 1; i >= 0; i--)
//        if (this.task_l[i].selected) this.task_l.splice(i, 1);
  }

  deleteSelectedTasksButton(o: number): void {
    
    if (TasksCfg.find(a => a.FName=="WarnOnDelete").FValue) {
    
    let dialogRef = this.DeleteTasksDialog.open(DialogDeleteTasks, {
      height: "200px",
      width: "100%",
      data: {
        numberOfTasks: ((o==0)? 1 : this.TL.countSelIf(this.applyFilter)),
        confirmation: true,
        doIt: true
      },
      panelClass: 'custom-modalbox-error'
    } 
    );

    dialogRef.afterClosed().subscribe(result => {
      
      if (typeof(result) != "undefined") {
      TasksCfg.find(a => a.FName=="WarnOnDelete").FValue = result.confirmation;

      if (result.doIt)
        this.doDeleteTasks(o);
      }
    });
    }
    else
        this.doDeleteTasks(o);
  }

/*
  numSelectedTasks(): number {
      return this.TL.countSel();
//    return this.TL.task_l.filter(x => x.selected).length;
//    return this.task_l.filter(x => x.selected && x.filter).length;
  }
*/

  isValidNewTask(): Boolean {
    return this.newTask.name != "" && this.newTask.description != "";
  }

  toggleNewTaskBar() {
    this.newTaskToggle = !this.newTaskToggle;
    if (this.newTaskToggle)
      this.createNewTaskTemplate ();
  }

  createNewTaskTemplate () {
    this.newTask = new TaskObj ("",this.Parameters["currentUser"],"", 0, new Date("2020-01-01") );

//    this.newTask.filter = true;
    this.newTask.selected = false;
  }

  ///////////////// OWN METHODS

  reassignSelectedTasks(assignee: number) {

      this.TL.doSel ( t => t.owner = assignee);

//      this.TL.task_l.filter(t => t.selected).forEach(t => t.owner = assignee);
//    for (let i = this.task_l.length - 1; i >= 0; i--)
//      if (this.task_l[i].selected) this.task_l[i].owner = assignee;
  }

  changeDueDateOnSelectedTasks(d: Date) {

    this.TL.doSel ( t => t.dueDate = new Date(this.toDueDate));
/*
    for (let i = this.TL.task_l.length - 1; i >= 0; i--)
      if (this.TL.task_l[i].selected)
        this.TL.task_l[i].dueDate = new Date(this.toDueDate);  */
  }
}



@Component({
  selector: "DialogDeleteTasks",
  templateUrl: "./delete-tasks-dialog.html"
})
export class DialogDeleteTasks {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteTasks>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {
    this.data.confirmation = true;
  }

  showAgain: boolean;

  toggelSwitchAgain(event) {
    this.showAgain = event.target.checked;
  }

  onNoClick(): void {
    this.data.doIt = false;
    this.dialogRef.close();
  }
}
