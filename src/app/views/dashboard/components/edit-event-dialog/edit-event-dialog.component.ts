import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IEvent } from '../../../../shared/interfaces/event.interface';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { EditEventPayload } from '../../../../shared/interfaces/edit-event-payload.interface';
import { Timestamp } from '@angular/fire/firestore';
import { MyErrorStateMatcher } from '../../../../shared/utils/input-error-state.matcher';
import { EventsService } from '../../../../shared/services/events.service';
import { ToastrService } from 'ngx-toastr';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer.component';

@Component({
  standalone: true,
  selector: 'app-edit-event-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogClose,
    QuillEditorComponent,
    ImageUploaderComponent,
    ImageViewerComponent,
  ],
  templateUrl: './edit-event-dialog.component.html',
  styleUrl: './edit-event-dialog.component.scss',
})
export class EditEventDialogComponent implements OnInit {
  public editEventForm!: FormGroup;
  public readonly data: { event: IEvent } = inject<{ event: IEvent }>(
    MAT_DIALOG_DATA
  );

  public imageURLs: string[] = [];
  public readonly matcher = new MyErrorStateMatcher();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _eventService: EventsService = inject(EventsService);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _dialogRef: MatDialogRef<EditEventDialogComponent> =
    inject(MatDialogRef);

  public ngOnInit(): void {
    this.initializeForm();
  }

  public initializeForm(): void {
    this.editEventForm = this._fb.group({
      headline: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.editEventForm.patchValue({
      headline: this.data.event.headline,
      description: this.data.event.description,
    });

    this.imageURLs = [...this.data.event.images];
  }

  public async submitForm(e: any): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    if (this.editEventForm.valid) {
      const { headline, description } = this.editEventForm.value;
      const payload: EditEventPayload = {
        headline,
        description,
        images: [...this.imageURLs],
      };

      try {
        await this._eventService.editEvent(this.data.event.id, payload);
        this._toastr.success('Event edited successfully!', 'Success', {
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

  public onUploadComplete(uploadedImageUrls: string[]): void {
    this.imageURLs = [...this.imageURLs, ...uploadedImageUrls];
  }

  public onImageDelete(imageUrl: string): void {
    this.imageURLs = this.imageURLs.filter((val) => val !== imageUrl);
  }
}
