import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class BannerService {
  private _supabase = inject(SupabaseService).client;

  async getAllBanners() {
    try {
      const response = await this._supabase.storage
        .from('images')
        .list('banners');

      if (response.data === null) {
        return [];
      }

      const images: string[] = [];

      for (const item of response.data) {
        const imageUrl = await this._supabase.storage
          .from('images')
          .getPublicUrl(`banners/${item.name}`);

        images.push(imageUrl.data.publicUrl);
      }

      return images;
    } catch (error) {
      throw error;
    }
  }
}
