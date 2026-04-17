import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BookStore} from '@features/book/state/book.store';
import {AssignTrainerDialogComponent} from './assign-trainer-dialog.component';
import {CreateRecordbookDialogComponent} from './create-recordbook-dialog.component';

@Component({
  selector: 'app-recordbook-management-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Recordbook Management</mat-card-title>
          <button
            mat-raised-button
            color="primary"
            (click)="openCreateRecordbookDialog()"
            class="create-btn">
            <mat-icon>add</mat-icon>
            New Recordbook
          </button>
        </mat-card-header>

        <mat-card-content>
          @if (bookStore.books().length > 0) {
            <table mat-table [dataSource]="bookStore.books()" class="books-table">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let element">{{ element.id }}</td>
              </ng-container>

              <!-- Trainee Column -->
              <ng-container matColumnDef="trainee">
                <th mat-header-cell *matHeaderCellDef>Trainee</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.trainee.forename }} {{ element.trainee.surname }}
                </td>
              </ng-container>

              <!-- Trainer Column -->
              <ng-container matColumnDef="trainer">
                <th mat-header-cell *matHeaderCellDef>Trainer</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.trainer?.forename || '-' }} {{ element.trainer?.surname || '-' }}
                </td>
              </ng-container>

              <!-- Weeks Column -->
              <ng-container matColumnDef="weeks">
                <th mat-header-cell *matHeaderCellDef>Weeks</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.weeks?.length || 0 }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <button
                    mat-icon-button
                    color="accent"
                    (click)="openAssignTrainerDialog(element.id)"
                    matTooltip="Assign Trainer">
                    <mat-icon>person_add</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="deleteRecordbook($event)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let element; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator
              [length]="bookStore.total()"
              [pageSize]="bookStore.size()"
              [pageSizeOptions]="[5, 10, 25]"
              (page)="onPageChange($event)">
            </mat-paginator>
          } @else {
            <p class="no-data">No recordbooks found</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .create-btn {
      margin-left: auto;
    }

    .books-table {
      width: 100%;
      margin-top: 16px;
    }

    .no-data {
      text-align: center;
      padding: 24px;
      color: #999;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RecordbookManagementPage {
  readonly bookStore = inject(BookStore);
  private readonly dialog = inject(MatDialog);

  displayedColumns = ['id', 'trainee', 'trainer', 'weeks', 'actions'];

  constructor() {
    this.bookStore.loadBooks(0, 10, () => {});
  }

  openCreateRecordbookDialog() {
    this.dialog
      .open(CreateRecordbookDialogComponent, {
        width: '500px',
      })
      .afterClosed()
      .subscribe((createdBook) => {
        if (!createdBook) {
          return;
        }

        this.bookStore.loadBooks(this.bookStore.page(), this.bookStore.size(), () => {});
      });
  }

  openAssignTrainerDialog(bookId: string) {
    this.dialog.open(AssignTrainerDialogComponent, {
      width: '500px',
      data: { bookId }
    });
  }

  deleteRecordbook(event: Event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this recordbook?')) {
      // TODO: Implement delete functionality
      alert('Delete recordbook functionality coming soon');
    }
  }

  onPageChange(event: PageEvent) {
    this.bookStore.loadBooks(event.pageIndex, event.pageSize, () => {});
  }
}
