import {Inject, Injectable} from '@angular/core';
import { MCObject } from './MC.core';

@Injectable({
  providedIn: 'root'
})

export class NCobjectS {

    private sequences: number[] = [];
    private ObjDB : MCObject[] = [];

    constructor (
//       @Inject('paramId') private paramId: string
    ) { 
      this.sequences[10] = 2;   // VIEW
      this.sequences[11] = 11;  // FIELD
      this.sequences[100] = 4;  // TASK


      this.ObjDB = [
        new MCObject (100, 1, 0, "Programa Tasks", 0, "Crear la versión 0.4", 0,
          {DueDate: new Date('2021-08-21')}),
        new MCObject (100, 2, 0, "Clase alemán", 0, "Clase por la tarde", 0,
          {DueDate: new Date('2021-08-21')}),
        new MCObject (100, 3, 0, "Deberes", 0, "Descripción 3", 0,
          {DueDate: new Date('2021-08-21')}),
        new MCObject (10, 1, 0, "Main view", 0, "Main tasks view", 0, {
          showTerminal: true,
          showGrid: false,
          showHeaders: true,
          sortField: 0,
          ascending: true
      })
      ];


    }


  private getSequence (clid: number): number {
    if (typeof this.sequences[clid] == "undefined") {
      this.sequences[clid] = 1;
    }    
    this.getSequence[clid]++;
    return this.getSequence[clid]-1;
  }


  public createObject (  ClassId: number, TypeId: number, Name: string, Owner: number, Desc: string, Status: number, xf: {[key: string]: any}): MCObject  {

    let s = this.getSequence (ClassId);
    let a = new MCObject (ClassId, s, TypeId, Name, Owner, Desc, Status, xf);

    this.ObjDB.push (a);
    return a;

  }

/*
  public insertObject (o: MCObject): number {
    return this.getSequence (o.getFieldValue("class#"));
  }
*/
  public getObjectOfClass (classid: number): MCObject[] {
//    let a : MCObject[]=[];
    
//    if (classid == 100) {
      return this.ObjDB.filter (t => {return (t.getFieldValue("class#")==classid)});

//      return A;
//    }

//    switch (classid)
//    {
/*
    case 100:  // TASK
      a = [
        new MCObject (100, 1, 0, "Programa Tasks", 0, "Crear la versión 0.4", 0,
          {DueDate: new Date('2021-08-21')}),
        new MCObject (100, 2, 0, "Clase alemán", 0, "Clase por la tarde", 0,
          {DueDate: new Date('2021-08-21')}),
        new MCObject (100, 3, 0, "Deberes", 0, "Descripción 3", 0,
          {DueDate: new Date('2021-08-21')}),
      ]
*/
//      a.forEach (o => o.setXField("DueDate", new Date('2021-08-21')));
//      break;
/*
    case 10:   // VIEW
      a = [ new MCObject (10, 1, 0, "Main view", 0, "Main tasks view", 0, {
      showTerminal: true,
      showGrid: false,
      showHeaders: true,
      sortField: 0,
      ascending: true
      })];
*/
/*
      a[0].setXField ("showTerminal", true);
      a[0].setXField ("showGrid", false);
      a[0].setXField ("showHeaders", true);
      a[0].setXField ("sortField", 0);
      a[0].setXField ("ascending", true);
*/
/*
      break;
    }

    return a;
*/
  }

}