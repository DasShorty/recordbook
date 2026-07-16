import {Component, ChangeDetectionStrategy, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog} from '@angular/material/dialog';
import {BookStore} from '@features/book/state/book.store';
import {BookWeek} from '@features/book/models/book.week.model';
import {DateFormatService} from '@features/book/services/date.format.service';
import {BookWeekStatus} from '@features/book/models/book.week.model';
import {WeekEditorDialogComponent} from '@features/book/week-overview/week-editor-dialog.component';

@Component({
  selector: 'app-week-fillout-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header class="header-row">
          <div>
            <mat-card-title>Week Calendar</mat-card-title>
            <mat-card-subtitle>Pick a blank week to create it or continue editing an existing one.</mat-card-subtitle>
          </div>

          <div class="year-controls">
            <button mat-icon-button type="button" (click)="previousYear()" aria-label="Previous year">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <span class="year-label">{{ selectedYear() }}</span>
            <button mat-icon-button type="button" (click)="nextYear()" aria-label="Next year">
              <mat-icon>chevron_right</mat-icon>
            </button>
            <button mat-stroked-button type="button" (click)="goToCurrentYear()">Current year</button>
          </div>
        </mat-card-header>

        <mat-card-content>
          @if (bookStore.loading()) {
            <div class="state-box">
              <mat-spinner></mat-spinner>
            </div>
          } @else if (!bookStore.activeBook().id) {
            <p class="no-data">No active recordbook found.</p>
          } @else {
            <div class="legend">
              @for (status of statusLegend; track status.status) {
                <span class="legend-item" [class]="status.status">
                  <span class="legend-dot"></span>
                  {{ status.label }}
                </span>
              }
            </div>

            <div class="calendar-grid">
              @for (entry of calendarWeeks(); track entry.weekNumber) {
                <button
                  type="button"
                  class="week-tile"
                  [class.blank]="entry.status === 'blank'"
                  [class.editing]="entry.status === 'editing'"
                  [class.submitted]="entry.status === 'submitted'"
                  [class.approved]="entry.status === 'approved'"
                  (click)="openWeek(entry)">
                  <div class="week-header">
                    <span class="week-number">KW {{ entry.weekNumber }}</span>
                    <span class="status-badge">{{ getStatusLabel(entry.status) }}</span>
                  </div>

                  @if (entry.week) {
                    <div class="week-range">
                      {{ formatWeekRange(entry.week.year, entry.week.calendarWeek) }}
                    </div>
                    <div class="day-preview">
                      @for (day of entry.week.days; track day.id) {
                        <span class="day-chip">
                          {{ getWeekdayName(day.date) }}
                        </span>
                      }
                    </div>
                  } @else {
                    <div class="blank-state">
                      <mat-icon>event_available</mat-icon>
                      <span>Blank week</span>
                    </div>
                  }

                  <div class="action-row">
                    @if (entry.status === 'blank') {
                      <span>Create week</span>
                      <mat-icon>add</mat-icon>
                    } @else if (entry.status === 'editing') {
                      <span>Continue editing</span>
                      <mat-icon>edit</mat-icon>
                    } @else {
                      <span>View week</span>
                      <mat-icon>visibility</mat-icon>
                    }
                  </div>
                </button>
              }
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .year-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .year-label {
      min-width: 72px;
      text-align: center;
      font-weight: 600;
    }

    .state-box {
      display: grid;
      place-items: center;
      min-height: 220px;
    }

    .legend {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.04);
      font-size: 0.85rem;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: currentColor;
    }

    .legend-item.blank { color: #6b7280; }
    .legend-item.editing { color: #2563eb; }
    .legend-item.submitted { color: #d97706; }
    .legend-item.approved { color: #16a34a; }

    .calendar-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    .week-tile {
      text-align: left;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 16px;
      padding: 16px;
      background: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 120ms ease, box-shadow 120ms ease;
    }

    .week-tile:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
    }

    .week-tile.blank { border-left: 6px solid #9ca3af; }
    .week-tile.editing { border-left: 6px solid #2563eb; }
    .week-tile.submitted { border-left: 6px solid #d97706; }
    .week-tile.approved { border-left: 6px solid #16a34a; }

    .week-header,
    .action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .week-number {
      font-size: 1.05rem;
      font-weight: 700;
    }

    .status-badge {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
      color: #4b5563;
    }

    .week-range {
      color: #4b5563;
      font-size: 0.9rem;
    }

    .day-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .day-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(37, 99, 235, 0.08);
      color: #1d4ed8;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .blank-state {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      min-height: 56px;
    }

    .action-row {
      color: #374151;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .no-data {
      text-align: center;
      padding: 24px;
      color: #999;
    }

    @media (max-width: 768px) {
      .header-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .week-tile {
        min-height: 180px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class WeekFilloutPage {
  readonly bookStore = inject(BookStore);
  private readonly dialog = inject(MatDialog);
  private readonly dateFormatService = inject(DateFormatService);

  protected readonly selectedYear = signal(new Date().getFullYear());
  protected readonly statusLegend: Array<{status: BookWeekStatus; label: string}> = [
    {status: 'blank', label: 'Blank'},
    {status: 'editing', label: 'Editing'},
    {status: 'submitted', label: 'Submitted'},
    {status: 'approved', label: 'Approved'},
  ];

  protected readonly calendarWeeks = computed(() => {
    const year = this.selectedYear();
    const weeksInYear = this.getWeeksInIsoYear(year);
    const allWeeks = this.bookStore.activeBook().weeks ?? [];

    return Array.from({length: weeksInYear}, (_, index) => {
      const weekNumber = index + 1;
      const week = allWeeks.find(item => item.year === year && item.calendarWeek === weekNumber);
      return {
        weekNumber,
        week,
        status: this.getWeekStatus(week),
      };
    });
  });

  constructor() {
    this.bookStore.getOwnBook(() => {});
  }

  protected previousYear() {
    this.selectedYear.update(year => year - 1);
  }

  protected nextYear() {
    this.selectedYear.update(year => year + 1);
  }

  protected goToCurrentYear() {
    this.selectedYear.set(new Date().getFullYear());
  }

  protected openWeek(entry: {weekNumber: number; week?: BookWeek; status: BookWeekStatus}) {
    const year = this.selectedYear();

    if (entry.status === 'blank') {
      this.openDialog({mode: 'create', calendarWeek: entry.weekNumber, year});
      return;
    }

    if (entry.status === 'editing') {
      this.openDialog({mode: 'edit', week: entry.week});
      return;
    }

    this.openDialog({mode: 'view', week: entry.week});
  }

  private openDialog(data: Record<string, unknown>) {
    this.dialog.open(WeekEditorDialogComponent, {
      width: '95vw',
      maxWidth: '900px',
      data,
    }).afterClosed().subscribe((result: {saved: boolean; weekId: string} | undefined) => {
      if (result?.saved) {
        this.bookStore.getOwnBook(() => {});
      }
    });
  }

  protected getStatusLabel(status: BookWeekStatus): string {
    switch (status) {
      case 'blank':
        return 'Blank';
      case 'editing':
        return 'Editing';
      case 'submitted':
        return 'Submitted';
      case 'approved':
        return 'Approved';
    }
  }

  protected getWeekdayName(dateStr: string): string {
    return this.dateFormatService.getWeekdayName(dateStr);
  }

  protected formatWeekRange(year: number, calendarWeek: number): string {
    const start = this.getIsoWeekStart(year, calendarWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

  private formatDate(date: Date): string {
    return this.dateFormatService.formatDate(this.toIsoDateString(date));
  }

  private toIsoDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getIsoWeekStart(year: number, calendarWeek: number): Date {
    const fourthOfJanuary = new Date(year, 0, 4);
    const day = fourthOfJanuary.getDay() || 7;
    const monday = new Date(fourthOfJanuary);
    monday.setDate(fourthOfJanuary.getDate() - day + 1 + (calendarWeek - 1) * 7);
    return monday;
  }

  private getWeeksInIsoYear(year: number): number {
    const lastWeekDate = new Date(year, 11, 28);
    return this.getIsoWeekNumber(lastWeekDate);
  }

  private getIsoWeekNumber(date: Date): number {
    const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = day.getUTCDay() || 7;
    day.setUTCDate(day.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
    return Math.ceil((((day.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  private getWeekStatus(week?: BookWeek | null): BookWeekStatus {
    if (!week?.id) {
      return 'blank';
    }

    if (week.signedFromTrainer) {
      return 'approved';
    }

    if (week.locked) {
      return 'submitted';
    }

    return 'editing';
  }
}
