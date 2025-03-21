import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SignInWithPasswordCredentials,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../shared/interfaces/user-profile.interface';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public auth: SupabaseAuthClient;
  public client: SupabaseClient;

  private _supabase!: SupabaseClient;
  private _session: AuthSession | null = null;
  private _date: Date = new Date();

  constructor() {
    this._supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.auth = this._supabase.auth;
    this.client = this._supabase;
    console.log(this._date);
  }

  get session() {
    this._supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  profile(user: UserProfile) {
    return this._supabase
      .from('user_profiles')
      .select()
      .eq('id', user.id)
      .single();
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this._supabase.auth.onAuthStateChange(callback);
  }

  signIn(credentials: SignInWithPasswordCredentials) {
    return this._supabase.auth.signInWithPassword(credentials);
  }

  signOut() {
    return this._supabase.auth.signOut();
  }

  updateProfile(profile: UserProfile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this._supabase.from('user_profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this._supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this._supabase.storage.from('avatars').upload(filePath, file);
  }
}
