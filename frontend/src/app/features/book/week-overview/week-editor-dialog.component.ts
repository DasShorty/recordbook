import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookDay} from '@features/book/models/book.day.model';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';

type WeekEditorMode = 'create' | 'edit';

type WeekEditorData = {
  mode: WeekEditorMode,
  week?: BookWeek,
};

type WeekEditorResult = {
  saved: boolean,
  weekId: BookWeekId,
};

@Component({
  selector: 'app-week-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create Week' : 'Edit Week' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-content">
        @if (data.mode === 'create') {
          <div class="row-fields">
            <mat-form-field appearance="outline">
              <mat-label>Calendar Week</mat-label>
              <input matInput type="number" formControlName="calendarWeek" min="1" max="53" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Year</mat-label>
              <input matInput type="number" formControlName="year" min="2000" max="2100" />
            </mat-form-field>
          </div>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Week Notes (optional)</mat-label>
          <textarea matInput rows="4" formControlName="text"></textarea>
        </mat-form-field>

        @if (dayGroups().length > 0) {
          <div class="days-grid" formArrayName="days">
            @for (group of dayGroups(); track $index) {
              <div class="day-row" [formGroup]="group">
                <div class="day-date">{{ group.get('date')?.value }}</div>
                <mat-form-field appearance="outline">
                  <mat-label>Hours</mat-label>
                  <input matInput type="number" formControlName="hours" min="0" max="24" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Minutes</mat-label>
                  <input matInput type="number" formControlName="minutes" min="0" max="59" />
                </mat-form-field>
              </div>
            }
          </div>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving()">Cancel</button>
      <button mat-raised-button color="primary" type="button" (click)="onSave()" [disabled]="form.invalid || isSaving()">
        {{ isSaving() ? 'Saving...' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .form-content {
        padding-top: 8px;
      }

      .full-width {
        width: 100%;
      }

      .row-fields {
        display: grid;
        gap: 12px;
        grid-template-columns: 1fr 1fr;
      }

      .days-grid {
        margin-top: 12px;
        display: grid;
        gap: 10px;
      }

      .day-row {
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr 140px 140px;
        align-items: center;
      }

      .day-date {
        font-size: 0.9rem;
        color: #374151;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekEditorDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<WeekEditorDialogComponent>);
  private readonly bookStore = inject(BookStore);
  private readonly weekStore = inject(BookWeekStore);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly data = inject<WeekEditorData>(MAT_DIALOG_DATA);

  protected readonly isSaving = signal(false);

  protected readonly form = this.fb.group({
    calendarWeek: [this.data.week?.calendarWeek ?? this.getCurrentWeek(), [Validators.required, Validators.min(1), Validators.max(53)]],
    year: [this.data.week?.year ?? new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
    text: [this.data.week?.text ?? ''],
    days: this.fb.array<FormGroup>([]),
  });

  protected readonly dayGroups = computed(() => this.days.controls as FormGroup[]);

  private get days(): FormArray<FormGroup> {
    return this.form.controls.days;
  }

  constructor() {
    if (this.data.mode === 'edit' && this.data.week) {
      this.form.controls.calendarWeek.disable();
      this.form.controls.year.disable();
      this.populateDays(this.data.week.days ?? []);
    }
  }

  protected onCancel() {
    this.dialogRef.close();
  }

  protected onSave() {
    if (this.form.invalid) {
      return;
    }

    const bookId = this.bookStore.activeBook().id;
    if (!bookId) {
      this.snackBar.open('No active recordbook found', 'Close', {duration: 3000});
      return;
    }

    this.isSaving.set(true);

    if (this.data.mode === 'edit' && this.data.week) {
      this.saveWeek(this.data.week.id, bookId, this.collectDaysFromForm(this.data.week.days ?? []));
      return;
    }

    const calendarWeek = this.form.controls.calendarWeek.value;
    const year = this.form.controls.year.value;

    if (!calendarWeek || !year) {
      this.isSaving.set(false);
      return;
    }

    this.weekStore.loadWeek(calendarWeek, year, bookId).subscribe({
      next: (week) => {
        this.populateDays(week.days ?? []);
        const days = this.collectDaysFromForm(week.days ?? []);
        this.saveWeek(week.id, bookId, days);
      },
      error: () => {
        this.isSaving.set(false);
        this.snackBar.open('Failed to prepare week', 'Close', {duration: 3000});
      },
    });
  }

  private saveWeek(weekId: BookWeekId, bookId: string, days: BookDay[]) {
    this.weekStore.updateWeekRequest(
      weekId,
      bookId,
      this.form.controls.text.value ?? '',
      days
    ).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.dialogRef.close({saved: true, weekId} as WeekEditorResult);
      },
      error: () => {
        this.isSaving.set(false);
        this.snackBar.open('Failed to save week', 'Close', {duration: 3000});
      },
    });
  }

  private populateDays(days: BookDay[]) {
    this.days.clear();
    for (const day of days) {
      this.days.push(BookDay.getFormGroup(day, false));
    }
  }

  private collectDaysFromForm(fallbackDays: BookDay[]): BookDay[] {
    if (this.days.length === 0) {
      return fallbackDays;
    }

    return this.dayGroups().map((group, index) => {
      const fallback = fallbackDays[index];
      return {
        id: (group.get('id')?.value ?? fallback?.id),
        date: (group.get('date')?.value ?? fallback?.date),
        hours: Number(group.get('hours')?.value ?? fallback?.hours ?? 0),
        minutes: Number(group.get('minutes')?.value ?? fallback?.minutes ?? 0),
        presence: group.get('presence')?.value ?? fallback?.presence,
        presenceLocation: group.get('presenceLocation')?.value ?? fallback?.presenceLocation,
      } as BookDay;
    });
  }

  private getCurrentWeek(): number {
    const date = new Date();
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
  }
}

