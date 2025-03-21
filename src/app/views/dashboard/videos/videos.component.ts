import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IVideo } from '../../../shared/interfaces/video.interface';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VideoService } from '../../../shared/services/video.service';
import { ToastrService } from 'ngx-toastr';
import { isAfter } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, NgOptimizedImage, AsyncPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { ViewVideoDialogComponent } from '../components/view-video-dialog/view-video-dialog.component';
import { AddVideoDialogComponent } from '../components/add-video-dialog/add-video-dialog.component';

@Component({
  selector: 'app-videos',
  imports: [
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    DatePipe,
    NgOptimizedImage,
    // AsyncPipe,
  ],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'thumbnail',
    'title',
    'createdAt',
    'actions',
  ];
  public dataSource!: MatTableDataSource<IVideo>;
  public dataLength!: number;
  public pageSizes: number[] = [5, 10, 20];
  public totalVideos!: Observable<number>;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _videoService: VideoService = inject(VideoService);
  private readonly _toastr: ToastrService = inject(ToastrService);

  public ngAfterViewInit() {
    this.fetchAllVideos();
    // this.totalEvents = this._eventService.getTotalEventsCount();
  }

  public async fetchAllVideos(): Promise<void> {
    try {
      const events = await this._videoService.getAllVideos();
      this.dataSource = new MatTableDataSource<IVideo>(
        events.sort((a, b) => {
          const aIsAfterB = isAfter(a.createdAt, b.createdAt);
          if (aIsAfterB) {
            return -1;
          } else {
            return 1;
          }
        })
      );

      this.dataLength = events.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }
  }

  public viewVideo(video: IVideo): void {
    this._dialog.open(ViewVideoDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        video,
      },
    });
  }

  public addVideo(): void {
    const dialogRef = this._dialog.open(AddVideoDialogComponent, {
      height: '800px', //'calc(100% - 30px)',
      width: '800px', //'calc(100% - 30px)',
      // maxWidth: '100%',
      // maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
    });

    dialogRef.afterClosed().subscribe({
      next: (shouldRefresh: boolean) => {
        if (shouldRefresh) {
          this.fetchAllVideos();
        }
      },
    });
  }

  public async deleteVideo(videoId: string): Promise<void> {
    try {
      await this._videoService.deleteVideo(videoId);
      this.fetchAllVideos();
      this._toastr.success('Video deleted successfully!', 'Success', {
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }
  }
}
