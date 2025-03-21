import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { Post } from '../interfaces/post.interface';
import { map, Observable } from 'rxjs';
import { CreatePostPayload } from '../interfaces/create-post-payload.interface';
import { EditPostPayload } from '../interfaces/edit-post-payload.interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _supabase = inject(SupabaseService).client;

  public async createPost(payload: CreatePostPayload): Promise<{
    status: number;
    statusText: string;
  }> {
    try {
      const response = await this._supabase.from('posts').insert(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getAllPosts(): Promise<Post[]> {
    const { data, error } = await this._supabase.from('posts').select();

    if (error) {
      throw error;
    }
    return data.map(
      (e) =>
        ({
          id: e.id,
          headline: e.headline,
          content: e.content,
          createdAt: new Date(e.created_at),
          createdBy: e.created_by,
          featuredImage: e.featured_image,
        } as Post)
    );
  }

  public async updatePost(
    postId: string,
    payload: EditPostPayload
  ): Promise<void> {
    try {
      await this._supabase.from('posts').update(payload).eq('id', postId);
    } catch (error) {
      throw error;
    }
  }

  public async deletePost(postId: string): Promise<void> {
    await this._supabase.from('posts').delete().eq('id', postId);
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
