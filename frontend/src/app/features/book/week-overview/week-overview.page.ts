import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';
import {WeekEditorDialogComponent} from './week-editor-dialog.component';

@Component({
  selector: 'app-week-overview-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Week Overview</mat-card-title>
          @if (isTrainee()) {
            <button
              mat-raised-button
              color="primary"
              class="create-btn"
              (click)="createNewWeek()">
              <mat-icon>add</mat-icon>
              Create Week
            </button>
          }
        </mat-card-header>

        <mat-card-content>
          @if (bookStore.loading()) {
            <mat-spinner></mat-spinner>
          } @else if (bookStore.activeBook().weeks && bookStore.activeBook().weeks.length > 0) {
            <mat-accordion>
              @for (week of bookStore.activeBook().weeks; track week.id) {
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <span class="week-title">
                        Week {{ week.calendarWeek }} / {{ week.year }}
                      </span>
                    </mat-panel-title>
                  </mat-expansion-panel-header>

                  <div class="week-details">
                    <p><strong>Notes:</strong> {{ week.text || 'No notes' }}</p>

                    @if (week.days && week.days.length > 0) {
                      <div class="days-section">
                        <h4>Days:</h4>
                        @for (day of week.days; track day.id) {
                          <div class="day-item">
                            <span>{{ day.presence }} - {{ day.hours }}h {{ day.minutes }}m</span>
                          </div>
                        }
                      </div>
                    }

                    @if (week.signedFromTrainer) {
                      <p class="signed-info">
                        ✓ Signed by: {{ week.signedFromTrainer.forename }} {{ week.signedFromTrainer.surname }}
                      </p>
                    }

                    <mat-divider class="action-divider"></mat-divider>

                    <div class="week-actions">
                      @if (isTrainee() && !week.locked && !week.signedFromTrainer) {
                        <button
                          mat-raised-button
                          color="accent"
                          (click)="editWeek(week.id)">
                          <mat-icon>edit</mat-icon>
                          Edit
                        </button>
                        <button
                          mat-raised-button
                          color="warn"
                          (click)="deleteWeek(week.id)">
                          <mat-icon>delete</mat-icon>
                          Delete
                        </button>
                      }

                      @if (isTrainer() && !week.signedFromTrainer) {
                        <button
                          mat-raised-button
                          color="primary"
                          (click)="reviewWeek(week.id)">
                          <mat-icon>assignment_turned_in</mat-icon>
                          Review
                        </button>
                      }
                    </div>
                  </div>
                </mat-expansion-panel>
              }
            </mat-accordion>
          } @else {
            <p class="no-data">No weeks found</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1000px;
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

    .week-title {
      margin-right: 16px;
      font-weight: 500;
    }

    .week-details {
      padding: 16px 0;
    }

    .days-section {
      margin: 16px 0;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .day-item {
      padding: 8px;
      border-left: 3px solid #1976d2;
      margin-bottom: 8px;
      padding-left: 12px;
    }

    .signed-info {
      color: #4caf50;
      font-weight: 500;
      margin-top: 16px;
    }

    .action-divider {
      margin: 16px 0;
    }

    .week-actions {
      display: flex;
      gap: 8px;
    }

    .no-data {
      text-align: center;
      padding: 24px;
      color: #999;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class WeekOverviewPage {
  readonly bookStore = inject(BookStore);
  private readonly weekStore = inject(BookWeekStore);
  private readonly userStore = inject(UserStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.bookStore.getOwnBook(() => {
    });
  }

  isTrainee(): boolean {
    return this.userStore.getActiveUser().authority === Authority.TRAINEE;
  }

  isTrainer(): boolean {
    return this.userStore.getActiveUser().authority === Authority.TRAINER;
  }

  createNewWeek() {
    this.dialog
      .open(WeekEditorDialogComponent, {
        width: '640px',
        data: {mode: 'create'},
      })
      .afterClosed()
      .subscribe((result: { saved: boolean, weekId: BookWeekId } | undefined) => {
        if (result?.saved && result.weekId) {
          this.bookStore.getOwnBook(() => {
          });
          this.updateWeekIdQueryParam(result.weekId);
        }
      });
  }

  editWeek(weekId: BookWeekId) {
    const week = this.findWeekById(weekId);
    if (!week) {
      return;
    }

    this.dialog
      .open(WeekEditorDialogComponent, {
        width: '640px',
        data: {mode: 'edit', week},
      })
      .afterClosed()
      .subscribe((result: { saved: boolean, weekId: BookWeekId } | undefined) => {
        if (result?.saved && result.weekId) {
          this.bookStore.getOwnBook(() => {
          });
          this.updateWeekIdQueryParam(result.weekId);
        }
      });
  }

  deleteWeek(weekId: BookWeekId) {
    if (confirm('Are you sure you want to delete this week?')) {
      this.weekStore.deleteWeek(weekId).subscribe({
        next: () => {
          alert('Week deleted successfully');
          this.bookStore.getOwnBook(() => {
          });
        },
        error: () => {
          alert('Failed to delete week');
        }
      });
    }
  }

  reviewWeek(weekId: string) {
    alert(`Review week ${weekId} - navigate to approval page`);
  }

  private findWeekById(weekId: BookWeekId): BookWeek | undefined {
    return this.bookStore.activeBook().weeks?.find((week) => week.id === weekId);
  }

  private updateWeekIdQueryParam(weekId: BookWeekId) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {weekId},
      queryParamsHandling: 'merge',
    });
  }
}
