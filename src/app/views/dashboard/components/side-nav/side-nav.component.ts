import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-nav',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  private readonly _authService: AuthenticationService = inject(
    AuthenticationService
  );
  private readonly _router: Router = inject(Router);

  public logout(): void {
    this._authService.signOut();
    this._router.navigateByUrl('/login');
  }
}
