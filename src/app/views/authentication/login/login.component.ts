import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { UserCredential } from '@angular/fire/auth';
import { MyErrorStateMatcher } from '../../../shared/utils/input-error-state.matcher';
import { ToastrService } from 'ngx-toastr';
import {
  AuthChangeEvent,
  AuthTokenResponsePassword,
} from '@supabase/supabase-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public readonly matcher = new MyErrorStateMatcher();
  public showPassword: boolean = false;

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthenticationService);
  private readonly _router = inject(Router);
  private readonly _toastr = inject(ToastrService);

  public ngOnInit(): void {
    this.loginForm = this._fb.nonNullable.group({
      email: ['', Validators.email],
      password: [''],
    });

    // this._authService.authChanges((event: AuthChangeEvent) => {
    //   switch (event) {
    //     case 'SIGNED_OUT':
    //       this._router.navigate(['/login']);
    //       break;

    //     case 'SIGNED_IN':
    //       this._router.navigate(['/dashboard']);
    //       break;

    //     default:
    //       break;
    //   }
    // });
  }

  async login(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (!email || !password) {
        return;
      }

      try {
        const response: AuthTokenResponsePassword =
          await this._authService.signIn({
            email,
            password,
          });

        if (response.error !== null) {
          this._toastr.error('Invalid credentials', 'Error', {
            closeButton: true,
          });
          return;
        }

        this._toastr.success('Login success', 'Success', {
          closeButton: true,
        });
        this._router.navigateByUrl('/dashboard/home');
      } catch (error) {
        console.error('Login failed', error);
        this._toastr.error('Login failed', 'Error', {
          closeButton: true,
        });
      }
    }
  }
}
