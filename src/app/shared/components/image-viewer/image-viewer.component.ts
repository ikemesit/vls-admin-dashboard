import { NgFor, NgStyle } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  output,
  Output,
  OutputEmitterRef,
} from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../../../core/services/supabase.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image-viewer',
  imports: [NgStyle, MatIconModule],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  public imageURL: InputSignal<string | undefined> = input();
  public showDeleteIcon: InputSignal<boolean> = input(true);
  public deleteEvent: OutputEmitterRef<string> = output<string>();
  public image: string = '';

  private readonly _supabase: SupabaseClient = inject(SupabaseService).client;
  private readonly _toastrService: ToastrService = inject(ToastrService);

  constructor() {
    effect(() => {
      if (this.imageURL()) {
        this.image = this.imageURL() as string;
      }
    });
  }

  deleteFile(imageUrl: string, e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();

    const filename = imageUrl.split('/').pop();
    const filePath = `banners/${filename}`;

    this._supabase.storage
      .from('images')
      .remove([filePath])
      .then(() => {
        this._toastrService.success('Image deleted successfully!');
        this.deleteEvent.emit(imageUrl);
      })
      .catch((error) => {
        console.error('Error removing file: ', error);
        this._toastrService.error('Error deleting banner!');
      });
  }
}
