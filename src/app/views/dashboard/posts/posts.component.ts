import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Post } from '../../../shared/interfaces/post.interface';
import { PostsService } from '../../../shared/services/post.service';
import { NewPostDialogComponent } from '../components/new-post-dialog/new-post-dialog.component';
import { isAfter } from 'date-fns';
import { ViewPostDialogComponent } from '../components/view-post-dialog/view-post-dialog.component';
import { EditPostDialogComponent } from '../components/edit-post-dialog/edit-post-dialog.component';

@Component({
  selector: 'app-posts',
  imports: [
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'featuredImage',
    'headline',
    'datePosted',
    'actions',
  ];
  public dataSource!: MatTableDataSource<Post>;
  public dataLength!: number;
  public pageSizes: number[] = [5, 10, 20];
  public totalPosts!: Observable<number>;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _postsService: PostsService = inject(PostsService);
  private readonly _toastr: ToastrService = inject(ToastrService);

  public ngAfterViewInit() {
    this.fetchPosts();
    // this.totalPosts = this._postsService.getTotalPostsCount();
  }

  public async fetchPosts(): Promise<void> {
    try {
      const posts = await this._postsService.getAllPosts();
      this.dataSource = new MatTableDataSource<Post>(
        posts.sort((a, b) => {
          const aIsAfterB = isAfter(a.createdAt, b.createdAt);
          if (aIsAfterB) {
            return -1;
          } else {
            return 1;
          }
        })
      );

      this.dataLength = posts.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }
  }

  public viewPost(post: Post): void {
    this._dialog.open(ViewPostDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        post,
      },
    });
  }

  public editPost(post: Post): void {
    const dialogRef = this._dialog.open(EditPostDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        post,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (shouldRefresh) => {
        if (shouldRefresh) {
          this.fetchPosts();
        }
      },
    });
  }

  public openNewPostDialog(): void {
    const dialogRef = this._dialog.open(NewPostDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
    });

    dialogRef.afterClosed().subscribe({
      next: (shouldRefresh: boolean) => {
        if (shouldRefresh) {
          this.fetchPosts();
        }
      },
    });
  }

  public async deletePost(postId: string): Promise<void> {
    try {
      await this._postsService.deletePost(postId);
      this._toastr.success('Article deleted successfully!', 'Success', {
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }

    this.dataSource.data = this.dataSource.data.filter(
      (post) => post.id !== postId
    );
  }
}
