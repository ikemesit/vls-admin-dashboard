import { inject, Injectable, signal } from '@angular/core';
import { from, Observable } from 'rxjs';
import { LoggedInUser } from '../../shared/interfaces/logged-in-user';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SignInWithPasswordCredentials,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../shared/interfaces/user-profile.interface';
import { Router, UrlTree } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public currentUser = signal<LoggedInUser | null | undefined>(undefined);

  _session: AuthSession | null = null;
  private readonly router: Router = inject(Router);
  private readonly _auth: SupabaseAuthClient = inject(SupabaseService).auth;
  private readonly _supabase: SupabaseClient = inject(SupabaseService).client;

  constructor() {}

  get session() {
    this._auth.getSession().then(({ data }) => {
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
    return this._auth.onAuthStateChange(callback);
  }

  signIn(credentials: SignInWithPasswordCredentials) {
    return this._auth.signInWithPassword(credentials);
  }

  async signOut() {
    await this._auth.signOut();
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

  async updatePassword(newPassword: string) {
    try {
      // const url = new URL(window.location.href);
      // const accessToken =
      //   url.searchParams.get('code') ||
      //   new URLSearchParams(url.hash.substring(1)).get('code');

      // if (!accessToken) {
      //   throw new Error('No access token found in URL');
      // }

      // const { data: sessionData, error: sessionError } =
      //   await this._supabase.auth.setSession({
      //     access_token: accessToken,
      //     refresh_token: '',
      //   });

      // if (sessionError) {
      //   console.log(sessionError);
      //   throw sessionError;
      // }

      const { data, error } = await this._supabase.auth.updateUser({
        // email: email,
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Password updated successfully',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating password: ${error}`,
      };
    }
  }

  async redirectUauthorizedToLogin(): Promise<UrlTree | boolean> {
    const response = await this._auth.getUser();

    return response.data.user === null
      ? this.router.createUrlTree(['/login'])
      : true;
  }

  async redirectLoggedInToDashboard(): Promise<boolean | UrlTree> {
    const response = await this._auth.getUser();

    return response.data.user ? this.router.createUrlTree(['/home']) : false;
  }
}
