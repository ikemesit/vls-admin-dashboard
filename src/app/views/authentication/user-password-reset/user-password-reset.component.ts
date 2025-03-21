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
import { SupabaseService } from '../../../core/services/supabase.service';
import { NgIf } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-password-reset',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './user-password-reset.component.html',
  styleUrl: './user-password-reset.component.scss',
})
export class UserPasswordResetComponent implements OnInit {
  public passwordResetForm!: FormGroup;

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthenticationService = inject(
    AuthenticationService
  );
  private readonly _toastrService: ToastrService = inject(ToastrService);

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.passwordResetForm = this._fb.group({
      // email: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.passwordResetForm.valid) {
      const { newPassword, confirmPassword } = this.passwordResetForm.value;

      if (newPassword === confirmPassword) {
        const response: {
          success: boolean;
          message: string;
          data?: any;
        } = await this._authService.updatePassword(newPassword);

        if (response.success)
          this._toastrService.success(
            'Password updated successfully',
            'Success'
          );
        this._authService.signOut();
      }
    }
  }
}
