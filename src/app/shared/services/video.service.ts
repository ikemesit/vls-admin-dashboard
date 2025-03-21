import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { IVideo } from '../interfaces/video.interface';
import { AddVideoPayload } from '../interfaces/add-video-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private _supabase = inject(SupabaseService).client;

  async saveVideoUrl(payload: AddVideoPayload): Promise<{
    status: number;
    statusText: string;
  }> {
    try {
      const response = await this._supabase.from('videos').insert(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getAllVideos(): Promise<IVideo[]> {
    const { data, error } = await this._supabase.from('videos').select();

    if (error) {
      throw error;
    }
    return data.map(
      (e) =>
        ({
          id: e.id,
          title: e.title,
          thumbnailUrl: e.thumbnail_url,
          createdAt: new Date(e.created_at),
        } as IVideo)
    );
  }

  public async deleteVideo(videoId: string): Promise<void> {
    await this._supabase.from('videos').delete().eq('id', videoId);
  }
}
