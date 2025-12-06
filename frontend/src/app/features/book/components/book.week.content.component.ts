import {ChangeDetectionStrategy, Component, input, OnChanges, output, signal, inject, effect} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookDay} from '@features/book/models/book.day.model';
import {Presence, PresenceDisplay, PresenceType} from '@features/book/models/presence.type';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookStore} from '@features/book/state/book.store';
import {DateFormatService} from '@features/book/services/date.format.service';
import {Button} from 'primeng/button';
import {BookDayRowComponent} from './book.day.row.component';

@Component({
  selector: 'book-week-content',
  imports: [CommonModule, TableModule, ReactiveFormsModule, Button, BookDayRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full">
      <p-table [value]="bookWeek().days" [scrollable]="true" scrollHeight="flex" style="width:100%; height:100%;">
        <ng-template #caption>
          <div class="flex items-center justify-between">
            <div class="text-xl font-bold">Woche {{ bookWeek().year }}/{{ bookWeek().calendarWeek }}</div>
            <div class="flex gap-2">
              <p-button (click)="onSave()" [disabled]="!canSave() || isSaving()">
                {{ isSaving() ? 'Saving...' : 'Save Week' }}
              </p-button>
              <p-button (click)="onCancel()" [disabled]="!hasChanges() || isSaving()" class="btn">Cancel</p-button>
            </div>
          </div>
          @if (validationError()) {
            <div class="text-red-600 mt-2">{{ validationError() }}</div>
          }
        </ng-template>

        <ng-template #header>
          <tr>
            <th>Tag / Datum</th>
            <th>Anwesenheit</th>
            <th>Ort</th>
            <th>Stunden</th>
          </tr>
        </ng-template>

        <ng-template #body let-day let-i="rowIndex">
          <tr book-day-row
              [form]="forms[i]"
              [day]="day"
              [presenceOptions]="presenceOptions"
              [presenceTypeOptions]="presenceTypeOptions">
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`` +
    `:host ::ng-deep tr.weekend { background-color: rgba(0, 0, 0, 0.03); }`
  ]
})
export class BookWeekContentComponent implements OnChanges {
  public readonly bookWeek = input.required<BookWeek>();
  public readonly weekSaved = output<BookWeek>();
  public forms: FormGroup[] = [];
  public isSaving = signal(false);
  public validationError = signal<string | null>(null);
  public readonly presenceOptions = Object.values(Presence).map(v => ({ value: v, label: PresenceDisplay.getPresenceDisplay(v as Presence) }));
  public readonly presenceTypeOptions = Object.values(PresenceType).map(v => ({ value: v, label: PresenceDisplay.getPresenceType(v as PresenceType) }));
  private originalDays: BookDay[] = [];
  private readonly bookWeekStore = inject(BookWeekStore);
  private readonly bookStore = inject(BookStore);
  protected readonly dateFormatService = inject(DateFormatService);

  constructor() {
    effect(() => {
      const loading = this.bookWeekStore.loading();
      if (!loading && this.isSaving()) {
        this.isSaving.set(false);
        const error = this.bookWeekStore.error();
        this.validationError.set(error ? 'Fehler beim Speichern der Woche. Bitte versuchen Sie es erneut.' : null);
        if (!error) this.forms.forEach(f => f.markAsPristine());
      }
    });
  }

  ngOnChanges(): void {
    this.originalDays = this.bookWeek().days.map(d => ({ ...d }));
    this.forms = this.originalDays.map(d => new FormGroup({
      id: new FormControl(d.id),
      date: new FormControl(d.date),
      presence: new FormControl(d.presence),
      presenceLocation: new FormControl(d.presenceLocation),
      duration: new FormControl(d.duration, { validators: [Validators.min(0), Validators.max(24)] }),
    }));
  }

  public hasChanges(): boolean { return this.forms.some(f => f.dirty); }
  public canSave(): boolean { return this.hasChanges() && this.validateTouchedDays(); }

  private validateTouchedDays(): boolean {
    this.validationError.set(null);
    for (let i = 0; i < this.forms.length; i++) {
      const form = this.forms[i];
      if (form.dirty && form.invalid) {
        const date = this.originalDays[i].date;
        const msg = `Der Tag ${this.dateFormatService.formatDate(date)} hat ungültige Werte. Bitte überprüfen Sie die Eingaben.`;
        // defer setting validation message to avoid change detection errors
        Promise.resolve().then(() => this.validationError.set(msg));
        return false;
      }
    }
    return true;
  }

  public onSave(): void {
    if (!this.canSave()) return;
    this.isSaving.set(true);
    const updatedDays = this.forms.map(f => ({
      id: f.get('id')!.value,
      date: f.get('date')!.value,
      presence: f.get('presence')!.value,
      presenceLocation: f.get('presenceLocation')!.value,
      duration: f.get('duration')!.value,
    }));

    const activeBook = this.bookStore.activeBook();
    if (!activeBook?.id) { this.validationError.set('Kein aktives Berichtsheft gefunden.'); this.isSaving.set(false); return; }

    this.bookWeekStore.updateWeek(this.bookWeek().id, activeBook.id, updatedDays);
  }

  public onCancel(): void {
    this.forms.forEach((f, i) => f.reset(this.originalDays[i] as any));
    this.validationError.set(null);
  }
}
