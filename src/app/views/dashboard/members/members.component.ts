import { DatePipe, NgOptimizedImage, AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { isAfter } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from '../../../shared/services/member.service';
import { UserProfile } from '../../../shared/interfaces/user-profile.interface';
import { ViewUserDialogComponent } from '../components/view-user-dialog/view-user-dialog.component';

@Component({
  selector: 'app-members',
  imports: [
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'name',
    'phone',
    'email',
    'state',
    'nin',
    'citizenshipStatus',
    // 'actions',
  ];
  public dataSource!: MatTableDataSource<UserProfile>;
  public dataLength!: number;
  public pageSizes: number[] = [5, 10, 20];
  public totalUsers!: Promise<number>;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _memberService: MemberService = inject(MemberService);
  private readonly _toastr: ToastrService = inject(ToastrService);

  public ngAfterViewInit() {
    this.fetchAllUsers();
    // this.totalEvents = this._memberService.getTotalEventsCount();
  }

  public async fetchAllUsers(): Promise<void> {
    try {
      const users = await this._memberService.getAllMembers();
      console.log(users);
      this.dataSource = new MatTableDataSource<UserProfile>(users);
      // users.sort((a, b) => {
      //   const aIsAfterB = isAfter(a.datePosted, b.datePosted);
      //   if (aIsAfterB) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // })

      this.dataLength = users.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }
  }

  public openViewUserDialog(user: UserProfile): void {
    const dialogRef = this._dialog.open(ViewUserDialogComponent, {
      width: '600px',
      height: '600px',
      data: {
        user,
      },
    });
  }
}
