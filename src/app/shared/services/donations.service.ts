import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { map, Observable } from 'rxjs';
import { DonationCampaign } from '../interfaces/campaign.interface';
import { EditCampaignPayload } from '../interfaces/edit-campaign-payload.interface';
import { CreateCampaignPayload } from '../interfaces/create-campaign-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class DonationsService {
  private _collectionPath = 'donations';
  private _firebaseService: FirebaseService = inject(FirebaseService);

  public async createCampaign(
    payload: CreateCampaignPayload
  ): Promise<DonationCampaign> {
    try {
      const campaign = (await this._firebaseService.create(
        this._collectionPath,
        payload
      )) as DonationCampaign;

      return campaign;
    } catch (error) {
      throw error;
    }
  }

  public getAllCampaigns(): Observable<DonationCampaign[]> {
    return this._firebaseService.getAll(this._collectionPath) as Observable<
      DonationCampaign[]
    >;
  }

  public async editCampaign(
    campaignId: string,
    payload: EditCampaignPayload
  ): Promise<void> {
    try {
      await this._firebaseService.update(
        this._collectionPath,
        campaignId,
        payload
      );
    } catch (error) {
      throw error;
    }
  }

  public deleteCampaign(campaignId: string): Promise<void> {
    return this._firebaseService.delete(this._collectionPath, campaignId);
  }

  public getTotalCampaignCount(): Observable<number> {
    return this.getAllCampaigns().pipe(map((data) => data.length));
  }

  public getTotalDonations(): Observable<number> {
    return this.getAllCampaigns().pipe(
      map((data) => data.reduce((acc, curr) => acc + curr.donatedAmount, 0))
    );
  }
}
