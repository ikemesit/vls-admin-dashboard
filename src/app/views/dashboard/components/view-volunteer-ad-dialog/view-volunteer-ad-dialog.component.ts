import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VolunteerAd } from '../../../../shared/interfaces/volunteer_ad.interface';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { VolunteerService } from '../../../../shared/services/volunteer.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-view-volunteer-ad-dialog',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogActions,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatDividerModule,
    MatDialogContent,
  ],
  templateUrl: './view-volunteer-ad-dialog.component.html',
  styleUrl: './view-volunteer-ad-dialog.component.scss',
})
export class ViewVolunteerAdDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public volunteers: {
    email: string;
    phone: string;
    lastname: string;
    firstname: string;
  }[] = [];

  public displayedColumns: string[] = [
    'firstname',
    'lastname',
    'phone',
    'email',
  ];

  public dataSource!: MatTableDataSource<{
    email: string;
    phone: string;
    lastname: string;
    firstname: string;
  }>;
  public dataLength!: number;
  public pageSizes: number[] = [5, 10, 20];
  public data: { ad: VolunteerAd } = inject<{ ad: VolunteerAd }>(
    MAT_DIALOG_DATA
  );

  private readonly _volunteerService: VolunteerService =
    inject(VolunteerService);

  public async ngOnInit(): Promise<void> {
    const response = await this._volunteerService.fetchAdVolunteers(
      this.data.ad.id
    );

    response?.map((v) => {
      console.log(v.user_profiles);
      this.volunteers.push(
        v.user_profiles as unknown as {
          email: string;
          phone: string;
          lastname: string;
          firstname: string;
        }
      );
    });

    this.dataSource = new MatTableDataSource(this.volunteers);
    console.log(this.dataSource.data);
  }
}
