import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { YouTubePlayer } from '@angular/youtube-player';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { VideoService } from '../../../../shared/services/video.service';
import { AddVideoPayload } from '../../../../shared/interfaces/add-video-payload.interface';
import { ToastrService } from 'ngx-toastr';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-add-video-dialog',
  imports: [
    MatDialogContent,
    MatIconModule,
    MatButtonModule,
    MatDialogClose,
    // YouTubePlayer,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogActions,
    ImageViewerComponent,
    ImageUploaderComponent,
  ],
  templateUrl: './add-video-dialog.component.html',
  styleUrl: './add-video-dialog.component.scss',
})
export class AddVideoDialogComponent {
  public videoUrl: string = '';
  // public videoId: string = '';
  public title: string = '';
  public thumbnailUrl: string = '';
  public showVideoPlayer: boolean = false;

  private readonly _videoService: VideoService = inject(VideoService);
  private readonly _toastrService: ToastrService = inject(ToastrService);
  private readonly _dialogRef: MatDialogRef<AddVideoDialogComponent> =
    inject(MatDialogRef);

  public verifyVideo(): void {
    if (this.videoUrl.length > 0) {
      this.showVideoPlayer = true;
    }
  }

  public clearVideo(): void {
    this.videoUrl = '';
    this.showVideoPlayer = false;
  }

  public getThumbnailUrl(url: string[]): void {
    this.thumbnailUrl = url[0];
  }

  // public onVideoUrlEntry(urlEntry: string): void {
  //   if (urlEntry.length > 0) {
  //     const url = new URL(urlEntry);
  //     const urlParams = new URLSearchParams(url.search);
  //     this.videoId = urlParams.get('v') as string;
  //     this.thumbnailUrl = `https://img.youtube.com/vi/${this.videoId}/default.jpg`;
  //   }
  // }

  // public validateVideoId(videoId: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     let img = new Image();
  //     img.src = `http://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  //     img.onload = () => resolve(this.checkThumbnail(img.width));
  //     img.onerror = reject;
  //   });
  // }

  // public checkThumbnail(width: number): boolean {
  //HACK a mq thumbnail has width of 320.
  //if the video does not exist(therefore thumbnail don't exist), a default thumbnail of 120 width is returned.
  //   if (width === 120) {
  //     return true;
  //   }

  //   return false;
  // }

  public async saveVideo() {
    if (
      this.videoUrl.length > 0 &&
      this.title.length > 0 &&
      this.thumbnailUrl.length > 0
    ) {
      const payload: AddVideoPayload = {
        title: this.title,
        thumbnail_url: this.thumbnailUrl,
        url: this.videoUrl,
      };

      try {
        await this._videoService.saveVideoUrl(payload);
        this._toastrService.success('Video saved!', 'Success', {
          closeButton: true,
        });
        this._dialogRef.close(true);
      } catch (error) {
        this._toastrService.error('An error occurred', 'Error', {
          closeButton: true,
        });
        this._dialogRef.close(false);
      }
    }
  }
}
