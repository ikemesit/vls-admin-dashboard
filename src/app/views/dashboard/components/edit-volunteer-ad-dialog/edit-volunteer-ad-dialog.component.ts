import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VolunteerService } from '../../../../shared/services/volunteer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { EditVolunteerAdPayload } from '../../../../shared/interfaces/edit-volunteer-ad.interface';

@Component({
  selector: 'app-edit-volunteer-ad-dialog',
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
  templateUrl: './edit-volunteer-ad-dialog.component.html',
  styleUrl: './edit-volunteer-ad-dialog.component.scss',
})
export class EditVolunteerAdDialogComponent implements OnInit {
  public editAdvertForm!: FormGroup;
  public isLoading: boolean = false;

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _volunteerService = inject(VolunteerService);
  private readonly _dialogRef = inject(
    MatDialogRef<EditVolunteerAdDialogComponent>
  );

  private _data: {
    id: number;
    title: string;
    description: string;
    expiresAt: Date;
  } = inject<{
    id: number;
    title: string;
    description: string;
    expiresAt: Date;
  }>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.initializeForm();
  }

  public initializeForm(): void {
    this.editAdvertForm = this._fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      expiresAt: [new Date(), Validators.required],
    });

    this.editAdvertForm.patchValue({
      title: this._data.title,
      description: this._data.description,
      expiresAt: new Date(this._data.expiresAt),
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.editAdvertForm.valid) {
      const { title, description, expiresAt } = this.editAdvertForm.value;
      const payload: EditVolunteerAdPayload = {
        title,
        description,
        expires_at: new Date(expiresAt).toISOString(),
      };

      try {
        await this._volunteerService.updateAd(this._data.id, payload);
        this._toastr.success('Advert edited successfully', 'Success', {
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
