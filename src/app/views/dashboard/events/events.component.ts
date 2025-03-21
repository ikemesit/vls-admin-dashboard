import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewEventDialogComponent } from '../components/new-event-dialog/new-event-dialog.component';
import { IEvent } from '../../../shared/interfaces/event.interface';
import { EventsService } from '../../../shared/services/events.service';
import { AsyncPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { EditEventDialogComponent } from '../components/edit-event-dialog/edit-event-dialog.component';
import { isAfter } from 'date-fns';
import { ViewEventDialogComponent } from '../components/view-event-dialog/view-event-dialog.component';

@Component({
  selector: 'app-events',
  imports: [
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    DatePipe,
    NgOptimizedImage,
    AsyncPipe,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'coverImage',
    'headline',
    'datePosted',
    'actions',
  ];
  public dataSource!: MatTableDataSource<IEvent>;
  public dataLength!: number;
  public pageSizes: number[] = [5, 10, 20];
  public totalEvents!: Promise<number>;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _eventService: EventsService = inject(EventsService);
  private readonly _toastr: ToastrService = inject(ToastrService);

  public ngAfterViewInit() {
    this.fetchAllEvents();
    this.totalEvents = this._eventService.getTotalEventsCount();
  }

  public async fetchAllEvents(): Promise<void> {
    try {
      const events = await this._eventService.getAllEvents();
      this.dataSource = new MatTableDataSource<IEvent>(
        events.sort((a, b) => {
          const aIsAfterB = isAfter(a.datePosted, b.datePosted);
          if (aIsAfterB) {
            return -1;
          } else {
            return 1;
          }
        })
      );

      this.dataLength = events.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }
  }

  public viewEvent(event: IEvent): void {
    this._dialog.open(ViewEventDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        event,
      },
    });
  }

  public openNewEventDialog(): void {
    const dialogRef = this._dialog.open(NewEventDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
    });

    dialogRef.afterClosed().subscribe({
      next: (shouldRefreshData) => {
        if (shouldRefreshData) {
          this.fetchAllEvents();
        }
      },
    });
  }

  public async deleteEvent(eventId: string): Promise<void> {
    try {
      await this._eventService.deleteEvent(eventId);
      this.dataSource.data = this.dataSource.data.filter(
        (data) => data.id !== eventId
      );
      this._toastr.success('Event deleted successfully!', 'Success', {
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      this._toastr.error('An error occurred!', 'Error', {
        closeButton: true,
      });
    }
  }

  public async openEditEventDialog(event: IEvent): Promise<void> {
    const dialogRef = this._dialog.open(EditEventDialogComponent, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      panelClass: 'mat-dialog-override',
      data: {
        event,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (shouldRefreshData) => {
        if (shouldRefreshData) {
          this.fetchAllEvents();
        }
      },
    });
  }
}
