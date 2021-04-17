import { Component, Input, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { TaskObj, TasksCfg } from "./tasks";
import { FlowActionObj, basicFlow } from "./flows";

//import { TASKS } from "./mock-tasks";

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
  idSequence: number;
  task_l: TaskObj[] =[];

  // From this class
  focus: TaskObj;

  reassignTo: number = 0;
  toDueDate: Date = new Date();

  newTaskToggle: boolean = false;

  newTask: TaskObj;
 

// QUITAR EL ID-SEQUENCE;  En el HTML, meter el getCreatorName / ¿se requiere clearNewTaskFields?

  ///////////////// CONSTRUCTOR

  ngOnInit() {
    // Retrieve tasks
    this.retrieveTasks();

    // Parse the initially selected tasks
    this.Parameters["initSelect"].forEach((n: number) => {
      if (n <= this.task_l.length) this.task_l[n - 1].selected = true;
    });


    // Template for new tasks
//    this.createNewTaskTemplate ();
//    this.clearNewTaskFields();
  }

  constructor (public DeleteTasksDialog: MatDialog) {}


  ///////////////// TASK-LIST METHODS

  retrieveTasks ()  {
    
    this.task_l.push (new TaskObj ("Programa Tasks", 0, "Crear la versión 0.4", 0, new Date('2021-04-21')));
    this.task_l.push (new TaskObj ("Clase alemán", 1, "Clase por la tarde", 1, new Date('2021-04-21')));
    this.task_l.push (new TaskObj ("Deberes", 0, "Descripción 3", 2, new Date('2021-04-21')));

/*
Name: string, Owner: number, Desc: string, Status: number, DueDate: Date

    let t: TaskObj = new TaskObj();
      t.id = 1;
      t.name = "Programa tasks";
      t.owner = 0;
      t.description = "Crear la versión 0.4";
      t.createdT = new Date();
      t.filter = true;
      t.selected = false;
      t.status = 0;
      t.creator = 0;
      t.dueDate = new Date('2021-04-21');
      t.resolvedT = null;
      t.closedT = null;
    this.task_l.push (t);

    t = new TaskObj();
      t.id = 2;
      t.name = "Clase Alemán";
      t.owner = 1;
      t.description = "Clase por la tarde";
      t.createdT = new Date();
      t.filter = true;
      t.selected = false;
      t.status = 1;
      t.creator = 0;
      t.dueDate = new Date('2021-04-21');
      t.resolvedT = null;
      t.closedT = null;
    this.task_l.push (t);
    
    t = new TaskObj();
      t.id = 3;
      t.name = "Deberes";
      t.owner = 0;
      t.description = "Descripción 3";
      t.createdT = new Date();
      t.filter = true;
      t.selected = false;
      t.status = 2;
      t.creator = 0;
      t.dueDate = new Date('2021-04-21');
      t.resolvedT = null;
      t.closedT = null;
    this.task_l.push (t);

*/
    this.idSequence = this.task_l.length;

  }


  deleteTask(t: TaskObj) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i] == t) {
        this.task_l.splice(i, 1);
        break;
      }
  }

  numTotalTasks(): number {
    return this.task_l.filter(x => x.filter).length;
  }

  numDueTasks(): number {
    return this.task_l.filter(t => t.dueTask()).length;
  }

  addNewTask(task: TaskObj) {
/*
    task.id = this.idSequence;
    task.createdT = new Date();
*/
    this.newTask.resolvedT = null;
    this.newTask.closedT = null;

//    this.task_l.push(Object.assign(new TaskObj(), task));
    this.task_l.push(this.newTask);
    this.createNewTaskTemplate ();

    this.idSequence++;
  }

  ///////////////// DB.VIEWER METHODS

  onMouseOver(t: TaskObj): void {
    this.focus = t;
  }

  onMouseOut(t: TaskObj): void {
    this.focus = null;
  }

  onSelectAll(e: Event): void {
    const checkbox = e.target as HTMLInputElement;
    for (let i = this.task_l.length - 1; i >= 0; i--) {
      this.task_l[i].selected = checkbox.checked;
    }
  }

  deleteSelectedTasks(): void {
      for (let i = this.task_l.length - 1; i >= 0; i--)
        if (this.task_l[i].selected) this.task_l.splice(i, 1);
  }

  deleteSelectedTasksButton(): void {
    
    if (TasksCfg.find(a => a.FName=="WarnOnDelete").FValue) {
    
    let dialogRef = this.DeleteTasksDialog.open(DialogDeleteTasks, {
      height: "200px",
      width: "100%",
      data: {
        numberOfTasks: this.numSelectedTasks(),
        confirmation: true,
        doIt: true
      },
      panelClass: 'custom-modalbox-error'
    } 
    );

    dialogRef.afterClosed().subscribe(result => {
      
      if (typeof(result) != "undefined") {
//      console.log(result);
      TasksCfg.find(a => a.FName=="WarnOnDelete").FValue = result.confirmation;

      if (result.doIt)
        this.deleteSelectedTasks();
      }
    });
    }
    else
        this.deleteSelectedTasks();
  }

  numSelectedTasks(): number {
    return this.task_l.filter(x => x.selected && x.filter).length;
  }

  isValidNewTask(): Boolean {
    return this.newTask.name != "" && this.newTask.description != "";
  }

  toggleNewTaskBar() {
    this.newTaskToggle = !this.newTaskToggle;
    if (this.newTaskToggle) {
      this.createNewTaskTemplate ();
}  }


  clearNewTaskFields() {
    this.newTask.name = "";
    this.newTask.owner = 0;
    this.newTask.description = "";
    this.newTask.filter = true;
    this.newTask.selected = false;
    this.newTask.status = 0;
//    this.newTask.creator = this.Parameters["currentUser"];
    this.newTask.dueDate = new Date("2020-01-01");
  }


  createNewTaskTemplate () {
console.log ("KO::", this.Parameters["currentUser"]);
    this.newTask = new TaskObj ("",this.Parameters["currentUser"],"", 0, new Date("2020-01-01") );
console.log ("CU::", this.newTask.owner);
  }

  ///////////////// OWN METHODS

  reassignSelectedTasks(assignee: number) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected) this.task_l[i].owner = assignee;
  }

  changeDueDateOnSelectedTasks(d: Date) {
    for (let i = this.task_l.length - 1; i >= 0; i--)
      if (this.task_l[i].selected)
        this.task_l[i].dueDate = new Date(this.toDueDate);
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
