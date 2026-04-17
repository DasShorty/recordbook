import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {BookStore} from '@features/book/state/book.store';
import {ApprovalDialogComponent} from './approval-dialog.component';

@Component({
  selector: 'app-week-approval-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Week Approval</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (bookStore.loading()) {
            <mat-spinner></mat-spinner>
          } @else if (bookStore.activeBook().weeks && bookStore.activeBook().weeks.length > 0) {
            <mat-tab-group>
              <mat-tab label="Pending Review">
                <div class="tab-content">
                  @for (week of getPendingWeeks(); track week.id) {
                    <mat-card class="week-card">
                      <mat-card-header>
                        <mat-card-subtitle>
                          Week {{ week.calendarWeek }} / {{ week.year }}
                        </mat-card-subtitle>
                      </mat-card-header>

                      <mat-card-content>
                        <p>{{ week.text || 'No notes' }}</p>
                      </mat-card-content>

                      <mat-card-actions>
                        <button
                          mat-raised-button
                          color="accent"
                          (click)="openApprovalDialog(week.id, 'accept')">
                          <mat-icon>check_circle</mat-icon>
                          Accept
                        </button>
                        <button
                          mat-raised-button
                          color="warn"
                          (click)="openApprovalDialog(week.id, 'deny')">
                          <mat-icon>cancel</mat-icon>
                          Deny
                        </button>
                      </mat-card-actions>
                    </mat-card>
                  }
                </div>
              </mat-tab>

              <mat-tab label="Accepted">
                <div class="tab-content">
                  @for (week of getAcceptedWeeks(); track week.id) {
                    <mat-card class="week-card">
                      <mat-card-header>
                        <mat-card-subtitle>
                          Week {{ week.calendarWeek }} / {{ week.year }}
                        </mat-card-subtitle>
                      </mat-card-header>

                      <mat-card-content>
                        <p>{{ week.text || 'No notes' }}</p>
                        @if (week.signedFromTrainer) {
                          <p class="signed-info">
                            Signed by: {{ week.signedFromTrainer.forename }} {{ week.signedFromTrainer.surname }}
                          </p>
                        }
                      </mat-card-content>
                    </mat-card>
                  }
                </div>
              </mat-tab>

              <mat-tab label="Denied">
                <div class="tab-content">
                  @for (week of getDeniedWeeks(); track week.id) {
                    <mat-card class="week-card">
                      <mat-card-header>
                        <mat-card-subtitle>
                          Week {{ week.calendarWeek }} / {{ week.year }}
                        </mat-card-subtitle>
                      </mat-card-header>

                      <mat-card-content>
                        <p>{{ week.text || 'No notes' }}</p>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          } @else {
            <p class="no-data">No weeks to review</p>
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

    .tab-content {
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .week-card {
      margin-bottom: 16px;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    mat-card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 16px;
      margin: 0;
    }

    .signed-info {
      color: #666;
      font-size: 0.9em;
      margin-top: 8px;
      font-style: italic;
    }

    .no-data {
      text-align: center;
      padding: 24px;
      color: #999;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class WeekApprovalPage {
  readonly bookStore = inject(BookStore);
  private readonly dialog = inject(MatDialog);

  constructor() {
    // Load the trainer's book
    this.bookStore.getOwnBook(() => {});
  }

  getPendingWeeks() {
    return this.bookStore.activeBook().weeks?.filter(w => w.locked && !w.signedFromTrainer) || [];
  }

  getAcceptedWeeks() {
    return this.bookStore.activeBook().weeks?.filter(w => w.signedFromTrainer) || [];
  }

  getDeniedWeeks() {
    return this.bookStore.activeBook().weeks?.filter(w => w.locked && !w.signedFromTrainer) || [];
  }

  openApprovalDialog(weekId: string, action: 'accept' | 'deny') {
    const week = this.bookStore.activeBook().weeks?.find(w => w.id === weekId);
    if (!week?.locked || week.signedFromTrainer) {
      return;
    }

    this.dialog.open(ApprovalDialogComponent, {
      width: '500px',
      data: { weekId, action }
    }).afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the book
        this.bookStore.getOwnBook(() => {});
      }
    });
  }
}
