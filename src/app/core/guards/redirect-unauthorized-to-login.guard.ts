import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '../services/supabase.service';

export const redirectUnauthorizedToLoginGuard: CanActivateFn = (
  route,
  state
): Observable<boolean> => {
  const router = inject(Router);
  const auth = inject(SupabaseService).auth;

  return of(auth.getUser()).pipe(
    switchMap(async (response) => {
      const { data } = await response;

      if (!data.user) {
        router.navigate(['/login']);
        return false;
      }

      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
