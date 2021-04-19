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

  TL : TaskList;

  // Visual components
  focus: TaskObj;     // Focused task
  newTask: TaskObj;   // Template for new Task

  // Window controls
  reassignTo: number = 0;
  newTaskToggle: boolean = false;

  // Task-specific
  toDueDate: Date = new Date();
 

  ///////////////// CONSTRUCTORS

  ngOnInit() {

    let p = { 
      initSelect : this.Parameters["initSelect"]
    };

    this.TL = new TaskList(p);

  }

  constructor (public DeleteTasksDialog: MatDialog) {}


  ///////////////// VISUAL EFFECTS

  applyFilter (t: TaskObj): boolean {
    return true;
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
  };

  toggleNewTaskBar() {
    this.newTaskToggle = !this.newTaskToggle;
    if (this.newTaskToggle)
      this.createNewTaskTemplate ();
  }

  createNewTaskTemplate () {
    this.newTask = new TaskObj ("",this.Parameters["currentUser"],"", 0, new Date("2020-01-01") );
  }

  isValidNewTask(): Boolean {
    return this.newTask.name != "" && this.newTask.description != "";
  }

  ///////////////// WINDOWS CONTROLS

  addNewTaskButton () {
    let I = this.newTask;
    
    this.TL.addNewTask (this.newTask);
    this.createNewTaskTemplate ();
    Object.assign (this.newTask, I);
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


  doDeleteTasks(o: number): void {

    switch (o) {
      case 0:   /* Focused */
        this.TL.splice(this.TL.indexOf(this.focus),1);
        break;
      case 1:  /* All selected */
        this.TL.deleteSel();
        break;
    }
  }


  reassignSelectedTasks(assignee: number) {
      this.TL.doSel ( t => t.owner = assignee);
  }



  ///////////////// TASK SPECIFIC METHODS

  changeDueDateOnSelectedTasks(d: Date) {
    this.TL.doSel ( t => t.dueDate = new Date(this.toDueDate));
  }

  numDueTasks(): number {
      return this.TL.countIf (t => (this.applyFilter(t) && t.dueTask()));
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
