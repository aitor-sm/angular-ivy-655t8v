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
  resolvedT: Date;
  closedT: Date;
}

export interface FlowActionObj {
  nextStatus: number;
  name: string;
}

export interface FlowStatusObj {
  name: string;
  resolutive: Boolean;
  terminal: Boolean;
  actions: FlowActionObj[];
}
