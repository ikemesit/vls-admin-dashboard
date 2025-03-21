import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { QuillEditorComponent } from 'ngx-quill';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { MatInputModule } from '@angular/material/input';
import { MyErrorStateMatcher } from '../../../../shared/utils/input-error-state.matcher';
import { DonationsService } from '../../../../shared/services/donations.service';
import { ToastrService } from 'ngx-toastr';
import { CreateCampaignPayload } from '../../../../shared/interfaces/create-campaign-payload.interface';
import { Timestamp } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-new-campaign-dialog',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDatepickerModule,
    QuillEditorComponent,
    ImageUploaderComponent,
    MatInputModule,
  ],
  templateUrl: './new-campaign-dialog.component.html',
  styleUrl: './new-campaign-dialog.component.scss',
})
export class NewCampaignDialogComponent implements OnInit {
  @ViewChild('editor')
  public editor!: QuillEditorComponent;

  public newDonationCampaignForm!: FormGroup;
  public selectedFiles: FileList | null = null;
  public downloadURLs: string[] = [];
  public uploadProgress: number[] = [];
  public readonly matcher = new MyErrorStateMatcher();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _donationsService: DonationsService =
    inject(DonationsService);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _dialogRef: MatDialogRef<NewCampaignDialogComponent> =
    inject(MatDialogRef);

  public ngOnInit(): void {
    this.newDonationCampaignForm = this._fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      targetAmount: ['', Validators.required],
    });
  }

  public async submitForm(): Promise<void> {
    if (this.newDonationCampaignForm.valid) {
      const { title, targetAmount, description } =
        this.newDonationCampaignForm.value;
      const payload: CreateCampaignPayload = {
        title,
        targetAmount,
        donatedAmount: 0,
        createdAt: Timestamp.now(),
        createdBy: '',
        status: 'active',
        description,
        coverImage: this.downloadURLs.length > 0 ? this.downloadURLs[0] : '',
      };

      try {
        await this._donationsService.createCampaign(payload);
        this._toastr.success('Donation Campaign created successfully!');
        this._dialogRef.close();
      } catch (error) {
        this._toastr.error('An error occurred', 'Create an event');
        console.log(error);
        this._dialogRef.close();
      }
    }
  }

  public onUploadComplete(imageUrls: string[]): void {
    this.downloadURLs = [...imageUrls];
  }
}
