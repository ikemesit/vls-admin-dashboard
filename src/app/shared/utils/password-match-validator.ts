import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator function
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Return null if controls haven't been initialized yet
    if (!password || !confirmPassword) {
      return { passwordMismatch: true };
    }

    // Return error if passwords don't match
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
