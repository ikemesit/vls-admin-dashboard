import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { of, switchMap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '../services/supabase.service';

export const redirectLoggedInToDashboardGuard: CanActivateFn = (
  route,
  state
) => {
  const router = inject(Router);
  const auth = inject(SupabaseService).auth;

  return of(auth.getUser()).pipe(
    switchMap(async (response) => {
      const { data } = await response;

      if (data.user) {
        router.navigate(['/dashboard']);
        return false;
      }

      return true;
    }),
    catchError(() => {
      return of(true);
    })
  );
};
