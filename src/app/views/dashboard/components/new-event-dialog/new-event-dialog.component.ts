import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ref,
  uploadBytesResumable,
  Storage,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
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
import { MyErrorStateMatcher } from '../../../../shared/utils/input-error-state.matcher';
import { QuillEditorComponent } from 'ngx-quill';
import { EventsService } from '../../../../shared/services/events.service';
import { CreateEventPayload } from '../../../../shared/interfaces/create-event-payload.interface';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-new-event-dialog',
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
    MatDatepickerModule,
    QuillEditorComponent,
    ImageUploaderComponent,
    ImageViewerComponent,
  ],
  templateUrl: './new-event-dialog.component.html',
  styleUrl: './new-event-dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewEventDialogComponent implements OnInit {
  @ViewChild('editor')
  public editor!: QuillEditorComponent;
  public newEventForm!: FormGroup;
  public selectedFiles: FileList | null = null;
  public imageURLs: string[] = [];
  public uploadProgress: number[] = [];
  public readonly matcher = new MyErrorStateMatcher();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _eventService: EventsService = inject(EventsService);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _dialogRef: MatDialogRef<NewEventDialogComponent> =
    inject(MatDialogRef);

  public ngOnInit(): void {
    this.newEventForm = this._fb.group({
      headline: ['', Validators.required],
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
    });
  }

  public async submitForm(): Promise<void> {
    if (this.newEventForm.valid) {
      const { headline, date, description } = this.newEventForm.value;
      const payload: CreateEventPayload = {
        headline,
        date,
        description,
        date_posted: new Date().toISOString(),
        images: [...this.imageURLs],
      };

      try {
        await this._eventService.createEvent(payload);
        this._toastr.success('Event created successfully!', 'Success', {
          closeButton: true,
        });
        this._dialogRef.close(true);
      } catch (error) {
        this._toastr.error('An error occurred', 'Error', {
          closeButton: true,
        });
        this._dialogRef.close();
      }
    }
  }

  public onUploadComplete(imageUrls: string[]): void {
    this.imageURLs = [...imageUrls];
  }
}
