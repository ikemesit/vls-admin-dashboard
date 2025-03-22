import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgIf } from '@angular/common';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { MyErrorStateMatcher } from '../../../shared/utils/input-error-state.matcher';
import { passwordMatchValidator } from '../../../shared/utils/password-match-validator';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-password-reset',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    LottieComponent,
  ],
  templateUrl: './user-password-reset.component.html',
  styleUrl: './user-password-reset.component.scss',
})
export class UserPasswordResetComponent implements OnInit {
  public passwordResetForm!: FormGroup;
  public readonly matcher = new MyErrorStateMatcher();
  public showSuccessMessage = false;
  public animationOptions: AnimationOptions = {
    path: 'animations/success.json',
    loop: false,
  };

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthenticationService = inject(
    AuthenticationService
  );
  private route: ActivatedRoute = inject(ActivatedRoute);
  private accessToken!: string;
  private refreshToken!: string;

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    // const accessToken = this.route.snapshot.queryParamMap.get('access_token');

    // this.accessToken = accessToken ? (accessToken as string) : '';

    // const refreshToken = this.route.snapshot.queryParamMap.get('refresh_token');

    // this.refreshToken = refreshToken ? (refreshToken as string) : '';

    this.passwordResetForm = this._fb.group(
      {
        email: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [passwordMatchValidator()],
      }
    );
  }

  public async onSubmit(): Promise<void> {
    if (this.passwordResetForm.valid) {
      try {
        const { email, newPassword, confirmPassword } =
          this.passwordResetForm.value;

        const response: {
          success: boolean;
          message: string;
          data?: any;
        } = await this._authService.updatePassword(email, newPassword);

        if (response.success === true) {
          console.log(response);
          this.showSuccessMessage = true;
          this._authService.signOut();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
