import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  InputSignal,
  output,
  Output,
  OutputEmitterRef,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SupabaseService } from '../../../core/services/supabase.service';
import { findLastIndex } from 'lodash';

@Component({
  selector: 'app-image-uploader',
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    NgStyle,
    NgFor,
  ],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss',
})
export class ImageUploaderComponent implements AfterViewInit {
  public imageURLs: InputSignal<string[] | undefined> = input();
  public maximumFilesSelection: InputSignal<number> = input<number>(4);
  public path: InputSignal<string> = input<string>('');
  public uploadComplete: OutputEmitterRef<string[]> = output();
  public deletedImage: OutputEmitterRef<string> = output();

  @ViewChild('filesInput')
  public filesInput!: ElementRef<HTMLInputElement>;

  @ViewChildren('imagePreview')
  public imagePreview!: QueryList<ElementRef<HTMLDivElement>>;

  public selectedFiles: FileList | null = null;
  public downloadURLs: string[] = [];
  public images: string[] = [];
  public uploadProgress: number[] = [];
  public showErrorMessages: boolean = false;
  public errorMessages: string[] = [];
  public progressBarMode: ProgressBarMode = 'determinate';

  private readonly _renderer: Renderer2 = inject(Renderer2);
  private readonly _toastr: ToastrService = inject(ToastrService);
  private readonly _supabase: SupabaseClient = inject(SupabaseService).client;

  constructor() {
    effect(() => {
      if (this.imageURLs()) {
        this.images = [...(this.imageURLs() as string[])];
      }
    });
  }

  public ngAfterViewInit(): void {
    // this.imagePreview.forEach((item, index) => {
    //   this._renderer.setStyle(
    //     item.nativeElement,
    //     'background-image',
    //     `url(${this.images[index]})`
    //   );
    // });
  }

  onFileSelected(event: Event): void {
    this.errorMessages = [];
    this.showErrorMessages = false;
    this.selectedFiles = (event.target as HTMLInputElement).files;
    if (
      this.selectedFiles &&
      this.selectedFiles?.length <= this.maximumFilesSelection()
    ) {
      this.uploadProgress = []; // Reset progress array

      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles.item(i);
        if (file && this.isValidFileType(file)) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const previewContainer = document.getElementById(
              `file${i}`
            ) as HTMLDivElement;

            this._renderer.setStyle(
              previewContainer,
              'background-image',
              `url(${e.target?.result})`
            );
          };

          reader.readAsDataURL(file);
        }
      }
    } else {
      this.errorMessages.push(
        `You cannot add more than ${this.maximumFilesSelection()} image(s)!`
      );
      this.showErrorMessages = true;
      this.selectedFiles = null;
    }
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  uploadFiles(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles.item(i);

        const fileName = `${Date.now()}${this.stripUnwantedCharacters(
          file?.name as string
        )}`;

        if (file) {
          this._supabase.storage
            .from('images')
            .upload(`${this.path()}/${fileName}`, file, {
              cacheControl: '3600',
              upsert: false,
            })
            .then((response) => {
              if (response.error) {
                console.error('Upload failed:', response.error);
                throw response.error;
              } else {
                return this._supabase.storage
                  .from('images')
                  .getPublicUrl(response.data.path);
              }
            })
            .then((url) => {
              this.downloadURLs.push(url.data.publicUrl);
              this.uploadProgress[i] = 100;
              this.uploadComplete.emit(this.downloadURLs);
              this._toastr.success('Image uploaded successfully!');
              setTimeout(() => (this.selectedFiles = null), 1000);
            })
            .catch((error) => {
              console.error('Upload failed:', error);
              this._toastr.error(error, 'Upload failed');
            });
        }
      }
    }
  }

  deleteFile(imageUrl: string, e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    this._supabase.storage
      .from('images')
      .remove([imageUrl])
      .then(() => {
        this.downloadURLs = this.downloadURLs.filter(
          (url) => !url.includes(imageUrl)
        );
        this.deletedImage.emit(imageUrl);
      })
      .catch((error) => {
        console.error('Error removing file: ', error);
      });
  }

  deselectFile(index: number, e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    const dt = new DataTransfer();

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        if (index !== i) {
          dt.items.add(file);
        }
      }
    }

    this.selectedFiles = dt.files;
  }

  clearSelections(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    this.selectedFiles = null;
  }

  stripUnwantedCharacters(inputString: string): string {
    const alphaNumericRegex = /[^a-zA-Z0-9]/g;

    const inputStrArray = inputString.split('.');
    const fileExt = inputStrArray.pop();
    const filenameWithoutExtension = inputStrArray.join('_');

    return `${filenameWithoutExtension.replace(
      alphaNumericRegex,
      ''
    )}.${fileExt}`;
  }
}
