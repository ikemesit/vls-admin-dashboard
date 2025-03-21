import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import * as AOS from 'aos';
import SmoothScroll from 'smooth-scroll';
import { AppStoreDialogComponent } from '../../shared/components/app-store-dialog/app-store-dialog.component';
import { PlayStoreDialogComponent } from '../../shared/components/play-store-dialog/play-store-dialog.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  title = 'APK Download Site';

  private _dialog: MatDialog = inject(MatDialog);

  public ngOnInit(): void {
    AOS.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 300,
      once: true,
      disable: 'mobile',
    });

    const scroll = new SmoothScroll('a[href*="#"]');
  }

  showAppStoreDialog() {
    this._dialog.open(AppStoreDialogComponent, {
      width: '200px',
      height: '200px',
    });
  }

  showPlayStoreDialog() {
    this._dialog.open(PlayStoreDialogComponent, {
      width: '200px',
      height: '200px',
    });
  }
}
