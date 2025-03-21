import {
  DatePipe,
  NgOptimizedImage,
  AsyncPipe,
  CurrencyPipe,
} from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DonationCampaign } from '../../../shared/interfaces/campaign.interface';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { isAfter } from 'date-fns';
import { DonationsService } from '../../../shared/services/donations.service';
import { ViewCampaignDialogComponent } from '../components/view-campaign-dialog/view-campaign-dialog.component';
import { NewCampaignDialogComponent } from '../components/new-campaign-dialog/new-campaign-dialog.component';
import { EditCampaignDialogComponent } from '../components/edit-campaign-dialog/edit-campaign-dialog.component';

@Component({
  selector: 'app-donations',
  imports: [
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    DatePipe,
    NgOptimizedImage,
    AsyncPipe,
    CurrencyPipe,
  ],
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.scss',
})
export class DonationsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'coverImage',
    'title',
    'targetAmount',
    'donatedAmount',
    'dateCreated',
    'actions',
  ];
  public dataSource!: MatTableDataSource<DonationCampaign>;
  public dataLength!: number;
  public pageSizes: number[] = [5, 10, 20];
  public totalCampaigns!: Observable<number>;
  public totalDonations!: Observable<number>;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _donationsService: DonationsService =
    inject(DonationsService);
  private readonly _toastr: ToastrService = inject(ToastrService);

  public ngAfterViewInit() {
    this._donationsService.getAllCampaigns().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<DonationCampaign>(
          data.sort((a, b) => {
            const aIsAfterB = isAfter(
              a.createdAt?.toDate(),
              b.createdAt?.toDate()
            );
            if (aIsAfterB) {
              return -1;
            } else {
              return 1;
            }
          })
        );
        this.dataLength = data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.totalCampaigns = this._donationsService.getTotalCampaignCount();
        this.totalDonations = this._donationsService.getTotalDonations();
      },
    });
  }

  public viewCampaign(campaign: DonationCampaign): void {
    this._dialog.open(ViewCampaignDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        campaign,
      },
    });
  }

  public openNewCampaignDialog(): void {
    console.log('open new campaign dialog');
    this._dialog.open(NewCampaignDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
    });
  }

  public async deleteCampaign(campaignId: string): Promise<void> {
    try {
      await this._donationsService.deleteCampaign(campaignId);
      this._toastr.success('Donation campaign deleted successfully!');
    } catch (error) {
      console.log(error);
      this._toastr.error('An error occurred!');
    }
  }

  public async openEditCampaignDialog(
    campaign: DonationCampaign
  ): Promise<void> {
    this._dialog.open(EditCampaignDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        campaign,
      },
    });
  }
}
