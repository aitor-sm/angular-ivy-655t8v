export interface TaskObj {
  id: number;
  name: string;
  owner: number;
  created: Date;
  description: string;
  filter: Boolean;
  selected: Boolean;
  status: number;
  creator: number;
  dueDate: Date;
}

export interface FlowActionObj {
  nextStatus: number;
  name: string;
}

export interface FlowStatusObj {
  name: string;
  terminal: Boolean;
  actions: FlowActionObj[];
}
