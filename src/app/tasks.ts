import { MCField, MCObject } from "./MC.core"
import { FlowActionObj, basicFlow } from "./flows";


////////////// TASK OBJECT ////////////////

export class TaskObj extends MCObject {

  // DB.View.Obj fields
  selected: boolean;


  public constructor (Name: string, Owner: number, Desc: string, Status: number, DueDate: Date) {

    super( 20, Name, Owner, Desc, Status);

    this.dueDate = DueDate;

    // DB.View.Obj init
    this.selected = false;

  }

  public get dueDate () {
      return this.getXField ("DueDate");
  }

  public set dueDate (d: Date) {
      this.setXField ("DueDate", d);
  }

  public dueTask(): boolean {
    return this.dueDate < new Date() && !basicFlow[this.status].terminal;
  };

}

////////////// TASK LIST OBJECT ////////////////


export class TaskList {

  protected task_l    : TaskObj[] = [];

  constructor (p: object) {

    this.retrieveTasks();

    p["initSelect"].forEach((n: number) => {
      if (n <= this.task_l.length) this.task_l[n - 1].selected = true;
    });

  }


  retrieveTasks ()  {
    this.task_l.push (new TaskObj ("Programa Tasks", 0, "Crear la versión 0.4", 0, new Date('2021-04-21')));
    this.task_l.push (new TaskObj ("Clase alemán", 1, "Clase por la tarde", 1, new Date('2021-04-21')));
    this.task_l.push (new TaskObj ("Deberes", 0, "Descripción 3", 2, new Date('2021-04-21')));
  }

 
  public addNewTask(task: TaskObj) {
//    this.task_l.push(Object.assign(new TaskObj(), task));
    this.task_l.push(task);
  }

  public getItem (i: number): TaskObj {
    return this.task_l[i];
  }

  public count(): number {
    return this.task_l.length;
  }

  public countIf(f: (arg0: TaskObj) => boolean): number {
    return this.task_l.filter(t => f(t)).length;
  }

  public countSel (): number {
    return this.task_l.filter(t => t.selected).length;
  }

  public countSelIf(f: (arg0: TaskObj) => boolean): number {
    return this.task_l.filter(t => t.selected && f(t)).length;
  }
  public do (f: (arg0: TaskObj) => void) {
    this.task_l.forEach (t => f(t));
  }

  public doIf (f: (arg0: TaskObj) => void, g: (arg0: TaskObj) => boolean) {
    this.task_l.filter(t => g(t)).forEach (t => f(t));
  }

  public doSel (f) {
    this.task_l.filter(t => t.selected).forEach (t => f(t));
  }

  public splice (n: number, m: number) {
    this.task_l.splice (n,m);
  }

  public indexOf (t: TaskObj): number {
    return this.task_l.indexOf (t);
  }

  public deleteSel () {
    this.task_l = this.task_l.reduce((p,c) => (!c.selected && p.push(c),p),[]);
  }

  public subFilter (f): TaskObj[] {
    return this.task_l.filter (f);
  }

}


////////////// TASK CONFIGURATION ////////////////

export var TasksCfg : MCField[] = [
  {
    FName: "WarnOnDelete",
    FCaption: "Alert me before deleting a task",
    FType: "boolean",
    FValue: true
  }
]
