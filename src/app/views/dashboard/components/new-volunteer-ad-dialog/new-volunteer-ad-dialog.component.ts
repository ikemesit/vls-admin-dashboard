import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import { CreateVolunteerAdPayload } from '../../../../shared/interfaces/create-volunteer-ad.interface';
import { VolunteerService } from '../../../../shared/services/volunteer.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-new-volunteer-ad-dialog',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    QuillEditorComponent,
  ],
  templateUrl: './new-volunteer-ad-dialog.component.html',
  styleUrl: './new-volunteer-ad-dialog.component.scss',
})
export class NewVolunteerAdDialogComponent implements OnInit {
  public newAdvertForm!: FormGroup;
  public isLoading: boolean = false;

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _volunteerService = inject(VolunteerService);
  private readonly _dialogRef = inject(
    MatDialogRef<NewVolunteerAdDialogComponent>
  );

  public ngOnInit(): void {
    this.newAdvertForm = this._fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      expiresAt: ['', Validators.required],
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.newAdvertForm.valid) {
      this.isLoading = true;
      const { title, description, expiresAt } = this.newAdvertForm.value;
      const payload: CreateVolunteerAdPayload = {
        title,
        description,
        expires_at: new Date(expiresAt).toISOString(),
      };

      try {
        await this._volunteerService.createAd(payload);
        this._toastr.success('Advert created successfully', 'Success', {
          closeButton: true,
        });
        this._dialogRef.close(true);
      } catch (error) {
        this._toastr.error('An error occurred', 'Error', {
          closeButton: true,
        });
        this._dialogRef.close(false);
      }
    }
  }
}
