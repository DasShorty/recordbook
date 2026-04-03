import {Component, ChangeDetectionStrategy, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-week-fillout-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Fill Out Week</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (weekStore.loading()) {
            <mat-spinner></mat-spinner>
          } @else if (weekStore.error()) {
            <p class="error-message">Error loading week: {{ weekStore.error() }}</p>
          } @else if (weekStore.week().id) {
            <form [formGroup]="form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Week Notes</mat-label>
                <textarea
                  matInput
                  formControlName="text"
                  rows="4"
                  placeholder="Add notes about this week..."></textarea>
              </mat-form-field>

              <div class="form-actions">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="onSave()"
                  [disabled]="form.invalid || isSaving()">
                  @if (isSaving()) {
                    <mat-icon matPrefix>hourglass_empty</mat-icon>
                  }
                  Save Week
                </button>

                <button
                  mat-raised-button
                  (click)="onSubmit()"
                  [disabled]="form.invalid || isSubmitting() || weekStore.week().locked">
                  @if (isSubmitting()) {
                    <mat-icon matPrefix>hourglass_empty</mat-icon>
                  }
                  Submit for Review
                </button>
              </div>

              @if (weekStore.week().locked) {
                <p class="info-message">This week is locked and cannot be edited.</p>
              }
            </form>
          } @else {
            <p class="no-data">No week selected</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
    }

    .form-actions button {
      flex: 1;
    }

    .error-message {
      color: #d32f2f;
      padding: 16px;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .info-message {
      color: #1976d2;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 4px;
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
export default class WeekFilloutPage {
  private readonly fb = inject(FormBuilder);
  private readonly bookStore = inject(BookStore);
  readonly weekStore = inject(BookWeekStore);
  isSaving = signal(false);
  isSubmitting = signal(false);

  form = this.fb.group({
    text: [''],
  });

  constructor() {
    this.loadCurrentWeek();
  }

  private loadCurrentWeek() {
    const now = new Date();
    const week = this.getWeekNumber(now);
    const year = now.getFullYear();
    const bookId = this.bookStore.activeBook().id;

    if (bookId) {
      this.weekStore.getWeek(week, year, bookId);
    }
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  onSave() {
    if (this.form.valid && this.weekStore.week().id) {
      this.isSaving.set(true);
      const week = this.weekStore.week();
      this.weekStore.updateWeek(
        week.id,
        this.bookStore.activeBook().id,
        this.form.get('text')?.value || '',
        week.days || []
      );
      // Reset after update
      setTimeout(() => this.isSaving.set(false), 1000);
    }
  }

  onSubmit() {
    if (this.form.valid && this.weekStore.week().id) {
      this.isSubmitting.set(true);
      this.weekStore.submitWeekToTrainer(this.weekStore.week().id);
      setTimeout(() => this.isSubmitting.set(false), 1000);
    }
  }
}
