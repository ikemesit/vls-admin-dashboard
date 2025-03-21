import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IEvent } from '../../../../shared/interfaces/event.interface';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-view-event-dialog',
  imports: [
    MatIconModule,
    MatDialogContent,
    MatDialogClose,
    MatButtonModule,
    DatePipe,
    MatDividerModule,
    MatDialogActions,
    ImageViewerComponent,
  ],
  templateUrl: './view-event-dialog.component.html',
  styleUrl: './view-event-dialog.component.scss',
})
export class ViewEventDialogComponent {
  public data: { event: IEvent } = inject<{ event: IEvent }>(MAT_DIALOG_DATA);
}
