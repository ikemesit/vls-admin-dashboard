import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-action-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './confirm-action-dialog.component.html',
  styleUrl: './confirm-action-dialog.component.scss',
})
export class ConfirmActionDialogComponent {
  public data: {
    title: string;
    message: string;
    action: string;
  } = inject<{
    title: string;
    message: string;
    action: string;
  }>(MAT_DIALOG_DATA);

  private readonly _dialogRef = inject(
    MatDialogRef<ConfirmActionDialogComponent>
  );

  confirm() {
    this._dialogRef.close(true);
  }
  cancel() {
    this._dialogRef.close(false);
  }
}
