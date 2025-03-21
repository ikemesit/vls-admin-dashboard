import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VolunteerAd } from '../../../shared/interfaces/volunteer_ad.interface';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VolunteerService } from '../../../shared/services/volunteer.service';
import { ToastrService } from 'ngx-toastr';
import { isAfter } from 'date-fns/isAfter';
import { ConfirmActionDialogComponent } from '../../../shared/components/confirm-action-dialog/confirm-action-dialog.component';
import { NewVolunteerAdDialogComponent } from '../components/new-volunteer-ad-dialog/new-volunteer-ad-dialog.component';
import { EditVolunteerAdDialogComponent } from '../components/edit-volunteer-ad-dialog/edit-volunteer-ad-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-volunteer-ads',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    DatePipe,
    MatSortModule,
  ],
  templateUrl: './volunteer-ads.component.html',
  styleUrl: './volunteer-ads.component.scss',
})
export class VolunteerAdsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = ['title', 'createdAt', 'actions'];
  public dataSource!: MatTableDataSource<VolunteerAd>;
  public dataLength!: number;
  public pageSizes: number[] = [5, 10, 20];
  public totalPosts!: Observable<number>;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _volunteerService: VolunteerService =
    inject(VolunteerService);
  private readonly _toastr: ToastrService = inject(ToastrService);

  public ngAfterViewInit() {
    this.fetchAds();
    // this.totalPosts = this._postsService.getTotalPostsCount();
  }

  public async fetchAds(): Promise<void> {
    try {
      const adverts = await this._volunteerService.getAllAds();
      this.dataSource = new MatTableDataSource<VolunteerAd>(
        adverts.sort((a, b) => {
          const aIsAfterB = isAfter(a.createdAt, b.createdAt);
          if (aIsAfterB) {
            return -1;
          } else {
            return 1;
          }
        })
      );

      this.dataLength = adverts.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }
  }

  public async openNewAdDialog(): Promise<void> {
    const dialogRef = this._dialog.open(NewVolunteerAdDialogComponent, {
      width: '800px',
      height: '750px',
      data: {
        title: 'Create a new ad',
        action: 'create',
      },
    });

    dialogRef.afterClosed().subscribe(async (shouldRefresh: boolean) => {
      if (shouldRefresh) {
        await this.fetchAds();
      }
    });
  }

  public viewAdDetails(ad: VolunteerAd): void {
    this._dialog.open(EditVolunteerAdDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        title: 'View Ad',
        action: 'view',
        ad,
      },
    });
  }

  public async deleteAd(adId: number): Promise<void> {
    const dialogRef = this._dialog.open(ConfirmActionDialogComponent, {
      width: '400px',
      height: '200px',
      data: {
        title: 'Delete Advert',
        message: `Are you sure you want to delete this Advert?`,
        action: 'delete',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this._volunteerService.deleteAd(adId);
        await this.fetchAds();
        this._toastr.success('Advert deleted successfully!', 'Success', {
          closeButton: true,
        });
      }
    });
  }
  public async editAd(ad: VolunteerAd): Promise<void> {
    const dialogRef = this._dialog.open(EditVolunteerAdDialogComponent, {
      width: '800px',
      height: '750px',
      data: {
        id: ad.id,
        title: ad.title,
        description: ad.description,
        expiresAt: ad.expiresAt,
      },
    });

    dialogRef.afterClosed().subscribe(async (shouldRefresh) => {
      if (shouldRefresh) {
        await this.fetchAds();
      }
    });
  }
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  public pageChanged(event: any): void {
    this.dataSource.paginator = event;
  }
  public sortData(event: any): void {
    this.dataSource.sort = event;
  }
}
