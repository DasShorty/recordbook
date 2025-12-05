import {ChangeDetectionStrategy, Component, input, OnChanges, output, signal, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookDay} from '@features/book/models/book.day.model';
import {Presence, PresenceDisplay, PresenceType} from '@features/book/models/presence.type';

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
              <button (click)="onSave()" [disabled]="!hasChanges() || isSaving()" class="btn btn-primary">Save Week
              </button>
              <button (click)="onCancel()" [disabled]="!hasChanges() || isSaving()" class="btn">Cancel</button>
            </div>
          </div>
        </ng-template>

        <ng-template #header>
          <tr>
            <th>Anwesenheit</th>
            <th>Ort</th>
            <th>Stunden</th>
          </tr>
        </ng-template>

        <ng-template #body let-i="rowIndex">
          <tr [formGroup]="forms[i]">
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
})
export class BookWeekContentComponent implements OnChanges {
  public readonly bookWeek = input.required<BookWeek>();
  public readonly weekSaved = output<BookWeek>();
  public forms: FormGroup[] = [];
  public isSaving = signal(false);
  public readonly presenceOptions = Object.values(Presence).map(v => ({
    value: v,
    label: PresenceDisplay.getPresenceDisplay(v as Presence)
  }));
  public readonly presenceTypeOptions = Object.values(PresenceType).map(v => ({
    value: v,
    label: PresenceDisplay.getPresenceType(v as PresenceType)
  }));
  private originalDays: BookDay[] = [];

  ngOnChanges(changes: SimpleChanges) {
    // build forms from bookWeek
    this.originalDays = this.bookWeek().days.map(d => ({...d}));
    this.forms = this.originalDays.map(d => new FormGroup({
      id: new FormControl(d.id),
      date: new FormControl(d.date),
      presence: new FormControl(d.presence, {validators: [Validators.required]}),
      presenceLocation: new FormControl(d.presenceLocation),
      duration: new FormControl(d.duration, {validators: [Validators.min(0)]}),
    }));
  }

  public hasChanges(): boolean {
    return this.forms.some(f => f.dirty);
  }

  public onSave() {
    if (!this.hasChanges()) return;
    this.isSaving.set(true);
    const updatedDays: BookDay[] = this.forms.map(f => ({
      id: f.get('id')!.value,
      date: f.get('date')!.value,
      presence: f.get('presence')!.value,
      presenceLocation: f.get('presenceLocation')!.value,
      duration: f.get('duration')!.value,
    }));

    const updatedWeek: BookWeek = {...this.bookWeek(), days: updatedDays} as BookWeek;

    // emit up; the signal store / parent should handle the actual save
    this.weekSaved.emit(updatedWeek);

    // after emit, mark forms pristine
    this.forms.forEach(f => f.markAsPristine());
    this.isSaving.set(false);
  }

  public onCancel() {
    // reset forms to original
    this.forms.forEach((f, i) => f.reset(this.originalDays[i] as any));
  }
}
