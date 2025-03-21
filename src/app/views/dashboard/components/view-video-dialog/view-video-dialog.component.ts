import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { IVideo } from '../../../../shared/interfaces/video.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-video-dialog',
  imports: [
    MatDialogClose,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    YouTubePlayerModule,
    DatePipe,
  ],
  templateUrl: './view-video-dialog.component.html',
  styleUrl: './view-video-dialog.component.scss',
})
export class ViewVideoDialogComponent {
  public data: { video: IVideo } = inject<{ video: IVideo }>(MAT_DIALOG_DATA);
}
