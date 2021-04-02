export interface TaskObj {
  id: number;
  name: string;
  done: Boolean;
  owner: number;
  created: Date;
  description: string;
  filter: Boolean;
  selected: Boolean;
  status: string;
  creator: number;
  dueDate: Date;
}
