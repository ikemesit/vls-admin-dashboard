import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-play-store-dialog',
  imports: [MatDialogClose, MatIconModule, MatButtonModule],
  templateUrl: './play-store-dialog.component.html',
  styleUrl: './play-store-dialog.component.scss',
})
export class PlayStoreDialogComponent {}
