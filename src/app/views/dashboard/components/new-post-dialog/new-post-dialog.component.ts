import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { CreatePostPayload } from '../../../../shared/interfaces/create-post-payload.interface';
import { PostsService } from '../../../../shared/services/post.service';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-new-post-dialog',
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
  templateUrl: './new-post-dialog.component.html',
  styleUrl: './new-post-dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewPostDialogComponent {
  @ViewChild('editor')
  public editor!: QuillEditorComponent;
  public newPostForm!: FormGroup;
  public selectedFiles: FileList | null = null;
  public imageURLs: string[] = [];
  public uploadProgress: number = 0;
  public readonly matcher = new MyErrorStateMatcher();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _postsService: PostsService = inject(PostsService);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _dialogRef: MatDialogRef<NewPostDialogComponent> =
    inject(MatDialogRef);

  public ngOnInit(): void {
    this.newPostForm = this._fb.group({
      headline: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  public async submitForm(): Promise<void> {
    if (this.newPostForm.valid) {
      const { headline, content } = this.newPostForm.value;
      const payload: CreatePostPayload = {
        headline,
        content,
        created_by: '',
        created_at: new Date().toISOString(),
        featured_image: this.imageURLs[0],
      };

      try {
        await this._postsService.createPost(payload);
        this._toastr.success('Article created successfully!', 'Success', {
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

  public onUploadComplete(imageUrls: string[]): void {
    console.log(imageUrls);
    this.imageURLs = [...imageUrls];
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }
}
