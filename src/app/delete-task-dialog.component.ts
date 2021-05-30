import {
  Component,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';


export interface DeleteDialogData {
  numberOfRecords: number;
  confirmation: boolean;
  doIt: boolean;
  recordName : string;
}


@Component({
  selector: 'DialogDeleteTasks',
  templateUrl: './delete-tasks-dialog.html'
})
export class DialogDeleteTasks {


  constructor(
    public dialogRef: MatDialogRef<DialogDeleteTasks>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {
    this.data.confirmation = true;
  }

  showAgain: boolean;

  toggelSwitchAgain(event) {
    this.showAgain = event.target.checked;
  }

  onNoClick(): void {
    this.data.doIt = false;
    this.dialogRef.close();
  }
}