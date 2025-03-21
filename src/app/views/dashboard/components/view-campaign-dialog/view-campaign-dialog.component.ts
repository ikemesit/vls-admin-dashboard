import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DonationCampaign } from '../../../../shared/interfaces/campaign.interface';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-view-campaign-dialog',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './view-campaign-dialog.component.html',
  styleUrl: './view-campaign-dialog.component.scss',
})
export class ViewCampaignDialogComponent {
  public data: { campaign: DonationCampaign } = inject<{
    campaign: DonationCampaign;
  }>(MAT_DIALOG_DATA);
}
