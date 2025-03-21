import { inject, Injectable } from '@angular/core';
import { IEvent } from '../interfaces/event.interface';
import { CreateEventPayload } from '../interfaces/create-event-payload.interface';
import { map, Observable, reduce } from 'rxjs';
import { EditEventPayload } from '../interfaces/edit-event-payload.interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '../../core/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private _supabase = inject(SupabaseService).client;

  public async createEvent(payload: CreateEventPayload): Promise<{
    status: number;
    statusText: string;
  }> {
    try {
      const response = await this._supabase.from('events').insert(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEvents(): Promise<IEvent[]> {
    const { data, error } = await this._supabase.from('events').select();

    if (error) {
      throw error;
    }
    return data.map(
      (e) =>
        ({
          id: e.id,
          headline: e.headline,
          date: new Date(e.date),
          description: e.description,
          datePosted: new Date(e.date_posted),
          images: e.images,
        } as IEvent)
    );
  }

  public async editEvent(
    eventId: string,
    payload: EditEventPayload
  ): Promise<void> {
    try {
      await this._supabase.from('events').update(payload).eq('id', eventId);
    } catch (error) {
      throw error;
    }
  }

  public async deleteEvent(eventId: string): Promise<void> {
    await this._supabase.from('events').delete().eq('id', eventId);
  }

  public async getTotalEventsCount(): Promise<number> {
    const { count, error } = await this._supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }
    return count ? count : 0;
  }
}
