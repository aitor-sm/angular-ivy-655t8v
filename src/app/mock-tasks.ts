import { TaskObj } from './tasks';

export const TASKS: TaskObj[] = [
  { id: 1, name: "Programa tasks", owner: 0, description: "Crear la versión 0.1", created:new Date(), filter:true, selected:false, status: 1, creator: 0,dueDate : new Date('2021-08-21'), resolvedT : null, closedT: null},
  { id: 2, name: "Clase Alemán", owner: 1, description: "Clase por la tarde", created:new Date(), filter:true, selected:false, status: 1, creator: 0,dueDate : new Date('2021-08-21'), resolvedT : null, closedT: null},
  { id: 3, name: "Deberes", owner: 0, description: "Descripción 3", created:new Date(), filter:true, selected:false, status: 2, creator: 0,dueDate : new Date('2021-08-21'), resolvedT : null, closedT: null}
]

