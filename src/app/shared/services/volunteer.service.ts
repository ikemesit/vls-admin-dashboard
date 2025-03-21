import { inject, Injectable } from '@angular/core';
import { EditPostPayload } from '../interfaces/edit-post-payload.interface';
import { SupabaseService } from '../../core/services/supabase.service';
import { CreateVolunteerAdPayload } from '../interfaces/create-volunteer-ad.interface';
import { VolunteerAd } from '../interfaces/volunteer_ad.interface';
import { EditVolunteerAdPayload } from '../interfaces/edit-volunteer-ad.interface';

@Injectable({
  providedIn: 'root',
})
export class VolunteerService {
  private _supabase = inject(SupabaseService).client;
  private _tableName = 'volunteer_ads';

  public async createAd(payload: CreateVolunteerAdPayload): Promise<{
    status: number;
    statusText: string;
  }> {
    try {
      const response = await this._supabase
        .from(this._tableName)
        .insert(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getAllAds(): Promise<VolunteerAd[]> {
    const { data, error } = await this._supabase.from(this._tableName).select();

    if (error) {
      throw error;
    }
    return data.map(
      (e) =>
        ({
          id: e.id,
          title: e.title,
          description: e.description,
          createdAt: new Date(e.created_at),
          expiresAt: new Date(e.expires_at),
        } as VolunteerAd)
    );
  }

  public async updateAd(
    adId: number,
    payload: EditVolunteerAdPayload
  ): Promise<void> {
    try {
      await this._supabase.from(this._tableName).update(payload).eq('id', adId);
    } catch (error) {
      throw error;
    }
  }

  public async deleteAd(adId: number): Promise<void> {
    await this._supabase.from(this._tableName).delete().eq('id', adId);
  }

  public async getTotalPostsCount(): Promise<number> {
    const { count, error } = await this._supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }
    return count ? count : 0;
  }
}
