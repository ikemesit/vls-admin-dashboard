import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { UserProfile } from '../interfaces/user-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private _supabase = inject(SupabaseService).client;

  public async getAllMembers(): Promise<UserProfile[]> {
    const { data, error } = await this._supabase.from('user_profiles').select();

    if (error) {
      throw error;
    }

    console.log(data);

    return data.map(
      (e) =>
        ({
          id: e.id,
          firstname: e.firstname,
          middlename: e.middlename,
          lastname: e.lastname,
          dob: new Date(e.dob),
          phone: e.phone,
          email: e.email,
          gender: e.gender,
          address: e.address,
          city: e.city,
          state: e.state,
          nin: e.nin,
          citizenshipStatus: e.citizenship_status,
          userId: e.userId,
        } as UserProfile)
    );
  }
}
