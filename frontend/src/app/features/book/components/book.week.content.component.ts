import {ChangeDetectionStrategy, Component, input, OnChanges, output, signal, SimpleChanges, inject, effect} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookDay} from '@features/book/models/book.day.model';
import {Presence, PresenceDisplay, PresenceType} from '@features/book/models/presence.type';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookStore} from '@features/book/state/book.store';

@Component({
  selector: 'book-week-content',
  imports: [CommonModule, TableModule, Select, InputNumber, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full">
      <p-table [value]="bookWeek().days" [scrollable]="true" scrollHeight="flex" style="width:100%; height:100%;">
        <ng-template #caption>
          <div class="flex items-center justify-between">
            <div class="text-xl font-bold">Woche {{ bookWeek().year }}/{{ bookWeek().calendarWeek }}</div>
            <div class="flex gap-2">
              <button (click)="onSave()" [disabled]="!canSave() || isSaving()" class="btn btn-primary">
                {{ isSaving() ? 'Saving...' : 'Save Week' }}
              </button>
              <button (click)="onCancel()" [disabled]="!hasChanges() || isSaving()" class="btn">Cancel</button>
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
          <tr [formGroup]="forms[i]" [class.weekend]="isWeekend(day.date)">
            <td class="px-2 py-1">
              <div class="flex flex-col">
                <span class="font-medium">{{ getWeekdayName(day.date) }}</span>
                <span class="text-sm text-gray-600">{{ formatDate(day.date) }}</span>
              </div>
            </td>
            <td class="px-2 py-1">
              <p-select
                class="w-full"
                formControlName="presence"
                [options]="presenceOptions"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Unbekannt"
                ariaLabel="Anwesenheit"
              ></p-select>
            </td>

            <td class="px-2 py-1">
              <p-select
                class="w-full"
                formControlName="presenceLocation"
                [options]="presenceTypeOptions"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Unbekannt"
                ariaLabel="Ort"
              ></p-select>
            </td>

            <td class="px-2 py-1 text-right">
              <p-input-number
                class="w-20 text-right"
                formControlName="duration"
                [min]="0"
                [max]="24"
                [step]="0.25"
                mode="decimal"
                ariaLabel="Stunden"
              ></p-input-number>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host ::ng-deep tr.weekend {
      background-color: rgba(0, 0, 0, 0.03);
    }
  `]
})
export class BookWeekContentComponent implements OnChanges {
  public readonly bookWeek = input.required<BookWeek>();
  public readonly weekSaved = output<BookWeek>();
  public forms: FormGroup[] = [];
  public isSaving = signal(false);
  public validationError = signal<string | null>(null);
  public readonly presenceOptions = Object.values(Presence).map(v => ({
    value: v,
    label: PresenceDisplay.getPresenceDisplay(v as Presence)
  }));
  public readonly presenceTypeOptions = Object.values(PresenceType).map(v => ({
    value: v,
    label: PresenceDisplay.getPresenceType(v as PresenceType)
  }));
  private originalDays: BookDay[] = [];
  private readonly bookWeekStore = inject(BookWeekStore);
  private readonly bookStore = inject(BookStore);

  constructor() {
    // React to store loading state
    effect(() => {
      const loading = this.bookWeekStore.loading();
      if (!loading && this.isSaving()) {
        // Update completed
        this.isSaving.set(false);
        const error = this.bookWeekStore.error();
        if (error) {
          this.validationError.set('Fehler beim Speichern der Woche. Bitte versuchen Sie es erneut.');
        } else {
          // Success - mark forms as pristine
          this.forms.forEach(f => f.markAsPristine());
          this.validationError.set(null);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // build forms from bookWeek
    this.originalDays = this.bookWeek().days.map(d => ({...d}));
    this.forms = this.originalDays.map(d => new FormGroup({
      id: new FormControl(d.id),
      date: new FormControl(d.date),
      presence: new FormControl(d.presence),
      presenceLocation: new FormControl(d.presenceLocation),
      duration: new FormControl(d.duration, {validators: [Validators.min(0), Validators.max(24)]}),
    }));
  }

  public hasChanges(): boolean {
    return this.forms.some(f => f.dirty);
  }

  public canSave(): boolean {
    return this.hasChanges() && this.validateTouchedDays();
  }

  private validateTouchedDays(): boolean {
    this.validationError.set(null);
    
    for (let i = 0; i < this.forms.length; i++) {
      const form = this.forms[i];
      
      // If the form is touched/dirty, it must be valid
      if (form.dirty) {
        if (form.invalid) {
          const date = this.originalDays[i].date;
          this.validationError.set(`Der Tag ${this.formatDate(date)} hat ungültige Werte. Bitte überprüfen Sie die Eingaben.`);
          return false;
        }
      }
    }
    
    return true;
  }

  public onSave() {
    if (!this.canSave()) return;
    
    this.isSaving.set(true);
    const updatedDays: BookDay[] = this.forms.map(f => ({
      id: f.get('id')!.value,
      date: f.get('date')!.value,
      presence: f.get('presence')!.value,
      presenceLocation: f.get('presenceLocation')!.value,
      duration: f.get('duration')!.value,
    }));

    const activeBook = this.bookStore.activeBook();
    if (!activeBook?.id) {
      this.validationError.set('Kein aktives Berichtsheft gefunden.');
      this.isSaving.set(false);
      return;
    }

    const bookId = activeBook.id;
    const weekId = this.bookWeek().id;

    // Call the store to update the week
    this.bookWeekStore.updateWeek(weekId, bookId, updatedDays);
  }

  public onCancel() {
    // reset forms to original
    this.forms.forEach((f, i) => f.reset(this.originalDays[i] as any));
    this.validationError.set(null);
  }

  public getWeekdayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { weekday: 'long' });
  }

  public formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  public isWeekend(dateStr: string): boolean {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }
}
