import { MCField, MCParameter, MCObject, MCUXObject } from "./MC.core";


////////////// TASK OBJECT ////////////////

export class TaskObj extends MCUXObject {


  public constructor (Name: string, Owner: number, Desc: string, Status: number, DueDate: Date) {

    super( 100, Name, Owner, Desc, Status);

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
    return this.dueDate < new Date() && !this.isTerminalStatus();
  };

}


////////////// VISUAL OBJECT LIST  ////////////////


export class MCUXList {

  protected obj_l    : MCUXObject[] = [];

  constructor (p: object) {

    this.retrieveItems();

    p["initSelect"].forEach((n: number) => {
      if (n <= this.obj_l.length) this.obj_l[n - 1].selected = true;
    });

  }

  // Retrieve specific to TAKS
  retrieveItems ()  {
    this.obj_l.push (new TaskObj ("Programa Tasks", 0, "Crear la versión 0.4", 0, new Date('2021-05-21')));
    this.obj_l.push (new TaskObj ("Clase alemán", 1, "Clase por la tarde", 1, new Date('2021-05-21')));
    this.obj_l.push (new TaskObj ("Deberes", 0, "Descripción 3", 2, new Date('2021-05-21')));
  }

 
  public addNewItem(task: MCUXObject) {
//    this.obj_l.push(Object.assign(new TaskObj(), task));
    this.obj_l.push(task);
  }

  public getItem (i: number): MCUXObject {
    return this.obj_l[i];
  }

  public count(): number {
    return this.obj_l.length;
  }

  public countIf(f: (arg0: MCUXObject) => boolean): number {
    return this.obj_l.filter(t => f(t)).length;
  }

  public countSel (): number {
    return this.obj_l.filter(t => t.selected).length;
  }

  public countSelIf(f: (arg0: MCUXObject) => boolean): number {
    return this.obj_l.filter(t => t.selected && f(t)).length;
  }
  public do (f: (arg0: MCUXObject) => void) {
    this.obj_l.forEach (t => f(t));
  }

  public doIf (f: (arg0: MCUXObject) => void, g: (arg0: MCUXObject) => boolean) {
    this.obj_l.filter(t => g(t)).forEach (t => f(t));
  }

  public doSel (f) {
    this.obj_l.filter(t => t.selected).forEach (t => f(t));
  }

  public splice (n: number, m: number) {
    this.obj_l.splice (n,m);
  }

  public indexOf (t: MCUXObject): number {
    return this.obj_l.indexOf (t);
  }

  public deleteSel () {
    this.obj_l = this.obj_l.reduce((p,c) => (!c.selected && p.push(c),p),[]);
  }

  public subFilter (f): MCUXObject[] {
    return this.obj_l.filter (f);
  }

  public selected (): MCUXObject[] {
    return this.obj_l.filter(t => t.selected);
  }

}



////////////// TASK CONFIGURATION ////////////////

export var TasksCfg : MCParameter[] = [
  {
    FName: "WarnOnDelete",
    FType: "boolean",
    FOptionality: "mandatory",
    FCaption: "Alert me before deleting a task",
    FValue: true,
    Default: true
  }
]
