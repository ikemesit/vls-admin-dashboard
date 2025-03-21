import { Timestamp } from '@angular/fire/firestore';

export interface CreateEventPayload {
  headline: string;
  description: string;
  date: string;
  date_posted: string;
  images: string[];
}
