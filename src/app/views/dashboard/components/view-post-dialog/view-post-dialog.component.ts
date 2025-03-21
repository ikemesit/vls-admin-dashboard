import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../../../shared/interfaces/post.interface';
import { MatDividerModule } from '@angular/material/divider';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-view-post-dialog',
  imports: [
    MatIconModule,
    MatDialogContent,
    MatDialogClose,
    MatButtonModule,
    MatDividerModule,
    MatDialogActions,
    DatePipe,
    ImageViewerComponent,
  ],
  templateUrl: './view-post-dialog.component.html',
  styleUrl: './view-post-dialog.component.scss',
})
export class ViewPostDialogComponent {
  public data: { post: Post } = inject<{ post: Post }>(MAT_DIALOG_DATA);
}
