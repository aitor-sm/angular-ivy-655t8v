export interface FlowActionObj {
  nextStatus: number;
  name: string;
}

export interface FlowStatusObj {
  name: string;
  resolutive: boolean;
  terminal: boolean;
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
