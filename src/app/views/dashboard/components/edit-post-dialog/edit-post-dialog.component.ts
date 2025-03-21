import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { Post } from '../../../../shared/interfaces/post.interface';
import { MyErrorStateMatcher } from '../../../../shared/utils/input-error-state.matcher';
import { PostsService } from '../../../../shared/services/post.service';
import { ToastrService } from 'ngx-toastr';
import { EditPostPayload } from '../../../../shared/interfaces/edit-post-payload.interface';
import { ImageViewerComponent } from '../../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-edit-post-dialog',
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
  templateUrl: './edit-post-dialog.component.html',
  styleUrl: './edit-post-dialog.component.scss',
})
export class EditPostDialogComponent {
  public editPostForm!: FormGroup;
  public readonly data: { post: Post } = inject<{ post: Post }>(
    MAT_DIALOG_DATA
  );

  public featuredImageUrl: string = '';
  public readonly matcher = new MyErrorStateMatcher();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _postService: PostsService = inject(PostsService);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _dialogRef: MatDialogRef<EditPostDialogComponent> =
    inject(MatDialogRef);

  public ngOnInit(): void {
    this.initializeForm();
    this.featuredImageUrl = this.data.post.featuredImage;
  }

  public initializeForm(): void {
    this.editPostForm = this._fb.group({
      headline: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.editPostForm.patchValue({
      headline: this.data.post.headline,
      content: this.data.post.content,
    });
  }

  public async submitForm(e: any): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    if (this.editPostForm.valid) {
      const { headline, content } = this.editPostForm.value;
      const payload: EditPostPayload = {
        headline,
        content,
        featured_image: this.featuredImageUrl,
      };

      try {
        await this._postService.updatePost(this.data.post.id, payload);
        this._toastr.success('Article edited successfully!', 'Success', {
          closeButton: true,
        });
        this._dialogRef.close(true);
      } catch (error) {
        this._toastr.error('An error occurred', 'Error', {
          closeButton: true,
        });
        this._dialogRef.close(false);
      }

      this._dialogRef.close();
    }
  }

  public onUploadComplete(imageUrls: string[]): void {
    this.featuredImageUrl = imageUrls[0];
  }

  public onImageDelete(deletedImageUrl: string): void {
    if (this.featuredImageUrl === deletedImageUrl) {
      this.featuredImageUrl = '';
    }
  }
}
