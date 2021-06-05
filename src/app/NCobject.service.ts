import {Inject, Injectable} from '@angular/core';
import { MCObject } from './MC.core';

@Injectable({
  providedIn: 'root'
})

export class NCobjectS {
    constructor (
//       @Inject('paramId') private paramId: string
    ) { }
  
  public getHello () : string {
    return "Hello!!!";
  }

  public getObjectOfClass (classid: number): MCObject[] {
    let a : MCObject[]=[];
    
    switch (classid)
    {
      
    case 100:
      a = [
        new MCObject (100, 0, "Programa Tasks", 0, "Crear la versión 0.4", 0),
        new MCObject (100, 0, "Clase alemán", 0, "Clase por la tarde", 0),
        new MCObject (100, 0, "Deberes", 0, "Descripción 3", 0),
      ]

      a.forEach (o => o.setXField("DueDate", new Date('2021-08-21')));
      break;

    case 10:
      a = [ new MCObject (10, 0, "Main view", 0, "Main tasks view", 0)];
      a[0].setXField ("showTerminal", true);
      a[0].setXField ("showGrid", false);
      a[0].setXField ("showHeaders", true);
      a[0].setXField ("sortField", 0);
      a[0].setXField ("ascending", true);
      break;
    }

    return a;
  }

}