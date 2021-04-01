export interface TaskObj {
  id: number;
  name: string;
  done: Boolean;
  owner: string;
  created: Date;
  description: string;
  filter: Boolean;
  selected: Boolean;
  status: string;
}
