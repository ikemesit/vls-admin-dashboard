import { Component, inject } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterEvent,
  RouterOutlet,
} from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthChangeEvent } from '@supabase/supabase-js';
import { tap } from 'rxjs';
import {
  NgxSpinner,
  NgxSpinnerComponent,
  NgxSpinnerModule,
  NgxSpinnerService,
} from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Volkspartij Leefbaar Suriname';
  public router: Router = inject(Router);

  private readonly _authService = inject(AuthenticationService);

  public spinnerService: NgxSpinnerService = inject(NgxSpinnerService);

  public ngOnInit(): void {
    this._authService.authChanges((event: AuthChangeEvent) => {
      console.log(event);

      // switch (event) {
      //   case 'SIGNED_OUT':
      //     this.router.navigate(['/login']);
      //     break;

      //   case 'SIGNED_IN':
      //     this.router.navigate(['/dashboard']);
      //     break;

      //   default:
      //     break;
      // }
    });

    this.router.events
      .pipe(
        tap((event) => {
          if (event instanceof NavigationStart) {
            this.spinnerService.show();
          }

          if (event instanceof NavigationEnd) {
            this.spinnerService.hide();
          }

          if (event instanceof NavigationError) {
            this.spinnerService.hide();
          }
        })
      )
      .subscribe();
  }
}
