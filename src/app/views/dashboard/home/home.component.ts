import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImageUploaderComponent } from '../../../shared/components/image-uploader/image-uploader.component';
import { BannerService } from '../../../shared/services/banner.service';
import { NgStyle } from '@angular/common';
import { ImageViewerComponent } from '../../../shared/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-home',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    ImageUploaderComponent,
    ImageViewerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public file = new FormControl();
  public currentBanners: string[] = [];

  private _bannerService: BannerService = inject(BannerService);

  public ngOnInit(): void {
    this.fetchAllBanners();
  }

  async fetchAllBanners(): Promise<void> {
    try {
      const response = await this._bannerService.getAllBanners();
      this.currentBanners = [...response];
    } catch (error) {
      console.log(error);
    }
  }

  updateBannerList(urls: string[], eventType: 'UPLOAD' | 'DELETE'): void {
    if (eventType === 'DELETE') {
      for (let url of urls) {
        this.currentBanners = this.currentBanners.filter((val) => val !== url);
      }

      return;
    }

    if (eventType === 'UPLOAD') {
      for (let url of urls) {
        this.currentBanners.unshift(url);
      }

      return;
    }
  }
}
