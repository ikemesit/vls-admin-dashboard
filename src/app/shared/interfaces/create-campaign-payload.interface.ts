import { Timestamp } from '@angular/fire/firestore';

export interface CreateCampaignPayload {
  title: string;
  description: string;
  targetAmount: number;
  donatedAmount: number;
  coverImage: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: Timestamp;
}
