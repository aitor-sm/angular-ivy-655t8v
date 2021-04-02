import { TaskObj } from './tasks';

export const TASKS: TaskObj[] = [
  { id: 1, name: "Programa tasks", owner: "Aitor", description: "Crear la versión 0.1", done: false, created:new Date(), filter:true, selected:false, status: "to-do", creator: "Aitor",dueDate : new Date('2021-04-21')},
  { id: 2, name: "Clase Tandem", owner: "Andreas", description: "Clase a Verónica", done: false, created:new Date(), filter:true, selected:false, status: "to-do", creator: "Aitor",dueDate : new Date('2021-04-21')},
  { id: 3, name: "Deberes", owner: "Aitor", description: "Descripción 3", done: false, created:new Date(), filter:true, selected:false, status: "to-do", creator: "Aitor",dueDate : new Date('2021-04-21')}
]
