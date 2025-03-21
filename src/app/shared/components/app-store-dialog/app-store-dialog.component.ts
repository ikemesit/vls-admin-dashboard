import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-app-store-dialog',
  imports: [MatDialogClose, MatIconModule, MatButtonModule],
  templateUrl: './app-store-dialog.component.html',
  styleUrl: './app-store-dialog.component.scss',
})
export class AppStoreDialogComponent {}
