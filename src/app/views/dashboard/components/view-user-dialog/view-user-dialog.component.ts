import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { UserProfile } from '../../../../shared/interfaces/user-profile.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-user-dialog',
  imports: [
    MatDialogContent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './view-user-dialog.component.html',
  styleUrl: './view-user-dialog.component.scss',
})
export class ViewUserDialogComponent {
  public data: { user: UserProfile } = inject(MAT_DIALOG_DATA);
}
