import { Timestamp } from '@angular/fire/firestore';

export interface Member {
  id?: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dob: Timestamp;
  phone: string;
  email: string;
  gender: string;
  dateJoined: Timestamp;
}
