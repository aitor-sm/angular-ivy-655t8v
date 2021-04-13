export interface TaskObj {
  // Object fields
  id: number;
  name: string;
  owner: number;
  created: Date;
  description: string;
  creator: number;
  // TaskObj fields
  status: number;
  dueDate: Date;
  resolvedT: Date;
  closedT: Date;
  // DB.Viewer fields
  filter: Boolean;
  selected: Boolean;
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

export var basicFlow : FlowStatusObj[] = [
    {
      name: "to-do",
      terminal: false,
      resolutive: false,
      actions: [
        {
          nextStatus: 1,
          name: "Start"
        },
        {
          nextStatus: 5,
          name: "Cancel"
        }
      ]
    },
    {
      name: "in progress",
      terminal: false,
      resolutive: false,
      actions: [
        {
          nextStatus: 2,
          name: "Block"
        },
        {
          nextStatus: 3,
          name: "Resolve"
        },
        {
          nextStatus: 5,
          name: "Cancel"
        }
      ]
    },
    {
      name: "blocked",
      terminal: false,
      resolutive: false,
      actions: [
        {
          nextStatus: 1,
          name: "Resume"
        },
        {
          nextStatus: 5,
          name: "Cancel"
        }
      ]
    },
    {
      name: "resolved",
      resolutive: true,
      terminal: false,
      actions: [
        {
          nextStatus: 1,
          name: "Reject"
        },
        {
          nextStatus: 4,
          name: "Verify"
        }
      ]
    },
    {
      name: "done",
      terminal: true,
      resolutive: true,
      actions: [
      ]
    },
    {
      name: "cancelled",
      terminal: true,
      resolutive: true,
      actions: [
      ]
    }
  ]


export interface MCField {
  FName: string;
  FCaption: string;
  FType: any;
  FValue: any;
}

export var TasksCfg : MCField[] = [
    {
      FName: "WarnOnDelete",
      FCaption: "Alert me before deleting a task",
      FType: "boolean",
      FValue: true
    }
]
