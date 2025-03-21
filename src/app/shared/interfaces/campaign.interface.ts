import { Timestamp } from '@angular/fire/firestore';

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  donatedAmount: number;
  coverImage: string;
  status: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
