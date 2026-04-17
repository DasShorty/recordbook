import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookDay} from '@features/book/models/book.day.model';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';
import {DateFormatService} from '@features/book/services/date.format.service';
import {Presence, PresenceDisplay, PresenceType} from '@features/book/models/presence.type';

type WeekEditorMode = 'create' | 'edit' | 'view';

type WeekEditorData = {
  mode: WeekEditorMode,
  week?: BookWeek,
  calendarWeek?: number,
  year?: number,
};

type WeekEditorResult = {
  saved: boolean,
  weekId: BookWeekId,
};

@Component({
  selector: 'app-week-editor-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'create' ? 'Create Week' : data.mode === 'view' ? 'Week Details' : 'Edit Week' }}
    </h2>

    <mat-dialog-content>
      @if (isLoadingWeek()) {
        <div class="loading-state">
          <p>Loading week...</p>
        </div>
      } @else {
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
                <div class="day-date">
                  <div class="day-name">{{ getWeekdayName(group.get('date')?.value ?? '') }}</div>
                  <div class="day-date-value">{{ formatDate(group.get('date')?.value ?? '') }}</div>
                </div>

                <mat-form-field appearance="outline">
                  <mat-label>Presence</mat-label>
                  <mat-select formControlName="presence">
                    <mat-option [value]="null">None</mat-option>
                    @for (presence of presenceOptions; track presence) {
                      <mat-option [value]="presence">
                        {{ getPresenceLabel(presence) }}
                      </mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Presence location</mat-label>
                  <mat-select formControlName="presenceLocation">
                    <mat-option [value]="null">None</mat-option>
                    @for (presenceType of presenceTypeOptions; track presenceType) {
                      <mat-option [value]="presenceType">
                        {{ getPresenceTypeLabel(presenceType) }}
                      </mat-option>
                    }
                  </mat-select>
                </mat-form-field>

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
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving() || isLoadingWeek()">Cancel</button>
      @if (isEditable()) {
        <button mat-raised-button color="primary" type="button" (click)="onSave()" [disabled]="form.invalid || isSaving() || isLoadingWeek()">
          {{ isSaving() ? 'Saving...' : 'Save' }}
        </button>
      } @else {
        <button mat-raised-button color="primary" type="button" (click)="onCancel()">
          Close
        </button>
      }
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
        grid-template-columns: 1.5fr 1fr 1fr 120px 120px;
        align-items: center;
      }

      .day-date {
        font-size: 0.9rem;
        color: #374151;
      }

      .day-name {
        font-weight: 600;
      }

      .day-date-value {
        font-size: 0.8rem;
        color: #6b7280;
      }

      .loading-state {
        min-height: 160px;
        display: grid;
        place-items: center;
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
  private readonly dateFormatService = inject(DateFormatService);
  protected readonly data = inject<WeekEditorData>(MAT_DIALOG_DATA);

  protected readonly isSaving = signal(false);
  protected readonly isLoadingWeek = signal(false);
  protected readonly presenceOptions = Object.values(Presence);
  protected readonly presenceTypeOptions = Object.values(PresenceType);
  private readonly loadedWeek = signal<BookWeek | null>(this.data.week ?? null);

  protected readonly form = this.fb.group({
    calendarWeek: [this.data.week?.calendarWeek ?? this.data.calendarWeek ?? this.getCurrentWeek(), [Validators.required, Validators.min(1), Validators.max(53)]],
    year: [this.data.week?.year ?? this.data.year ?? new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
    text: [this.data.week?.text ?? ''],
    days: this.fb.array<FormGroup>([]),
  });

  protected readonly dayGroups = computed(() => this.days.controls as FormGroup[]);
  protected readonly isEditable = computed(() => {
    return this.data.mode !== 'view' && this.isWeekEditable(this.loadedWeek());
  });

  private get days(): FormArray<FormGroup> {
    return this.form.controls.days;
  }

  constructor() {
    if (this.data.mode === 'edit' || this.data.mode === 'view') {
      this.form.controls.calendarWeek.disable();
      this.form.controls.year.disable();
      this.populateDays(this.data.week?.days ?? []);
    } else {
      this.loadWeekForCreate();
    }
  }

  protected onCancel() {
    if (this.data.mode === 'create' && this.loadedWeek()?.id) {
      this.weekStore.deleteWeek(this.loadedWeek()!.id).subscribe({
        next: () => this.dialogRef.close(),
        error: () => this.dialogRef.close(),
      });
      return;
    }

    this.dialogRef.close();
  }

  protected onSave() {
    if (this.form.invalid || !this.isEditable()) {
      return;
    }

    const bookId = this.bookStore.activeBook().id;
    if (!bookId) {
      this.snackBar.open('No active recordbook found', 'Close', {duration: 3000});
      return;
    }

    this.isSaving.set(true);
    const weekId = this.loadedWeek()?.id;

    if (!weekId) {
      this.isSaving.set(false);
      this.snackBar.open('Week could not be loaded', 'Close', {duration: 3000});
      return;
    }

    const fallbackDays = this.loadedWeek()?.days ?? [];
    this.saveWeek(weekId, bookId, this.collectDaysFromForm(fallbackDays));
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
        this.loadedWeek.set({
          ...(this.loadedWeek() as BookWeek),
          text: this.form.controls.text.value ?? '',
          days,
        });
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
      this.days.push(BookDay.getFormGroup(day, !this.isEditable()));
    }
  }

  private loadWeekForCreate() {
    const bookId = this.bookStore.activeBook().id;
    if (!bookId) {
      this.snackBar.open('No active recordbook found', 'Close', {duration: 3000});
      return;
    }

    const calendarWeek = this.form.controls.calendarWeek.value;
    const year = this.form.controls.year.value;

    if (!calendarWeek || !year) {
      return;
    }

    this.isLoadingWeek.set(true);
    this.weekStore.loadWeek(calendarWeek, year, bookId).subscribe({
      next: (week) => {
        this.loadedWeek.set(week);
        this.form.controls.text.setValue(week.text ?? '');
        this.populateDays(week.days ?? []);
        this.isLoadingWeek.set(false);
      },
      error: () => {
        this.isLoadingWeek.set(false);
        this.snackBar.open('Failed to prepare week', 'Close', {duration: 3000});
      },
    });
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

  protected getWeekdayName(dateStr: string): string {
    return this.dateFormatService.getWeekdayName(dateStr);
  }

  protected formatDate(dateStr: string): string {
    return this.dateFormatService.formatDate(dateStr);
  }

  protected getPresenceLabel(presence: Presence): string {
    return PresenceDisplay.getPresenceDisplay(presence);
  }

  protected getPresenceTypeLabel(presenceType: PresenceType): string {
    return PresenceDisplay.getPresenceType(presenceType);
  }

  private isWeekEditable(week: BookWeek | null): boolean {
    return this.getWeekStatus(week) === 'blank' || this.getWeekStatus(week) === 'editing';
  }

  private getWeekStatus(week?: BookWeek | null) {
    if (!week?.id) {
      return 'blank' as const;
    }

    if (week.signedFromTrainer) {
      return 'approved' as const;
    }

    if (week.locked) {
      return 'submitted' as const;
    }

    return 'editing' as const;
  }

  private getCurrentWeek(): number {
    const date = new Date();
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
  }
}

