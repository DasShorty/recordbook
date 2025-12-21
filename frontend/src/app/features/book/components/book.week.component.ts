import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookDay} from '@features/book/models/book.day.model';
import {Presence, PresenceDisplay, PresenceType} from '@features/book/models/presence.type';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookStore} from '@features/book/state/book.store';
import {DateFormatService} from '@features/book/services/date.format.service';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {RouterLink} from '@angular/router';
import {FloatLabel} from 'primeng/floatlabel';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'book-week-component',
  imports: [CommonModule, TableModule, ReactiveFormsModule, Button, Select, InputNumber, RouterLink, FormsModule, FloatLabel, Textarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full">
      <p-table [value]="bookWeek().days" [scrollable]="true" scrollHeight="flex" style="width:100%; height:100%;">
        <ng-template #caption>
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <p-button [queryParams]="{'cw': (this.bookWeek().calendarWeek - 1)}" routerLink="/record-book/week">
                <
              </p-button>
              <p-button [queryParams]="{'cw': (this.bookWeek().calendarWeek + 1)}" routerLink="/record-book/week">
                >
              </p-button>
            </div>
            <div class="text-xl font-bold">Woche {{ bookWeek().year }}/{{ bookWeek().calendarWeek }}</div>
            <div class="flex gap-2">
              <p-button (click)="onSave()" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : 'Save Week' }}
              </p-button>
              <p-button (click)="submitWeek()" [disabled]="submitted()">
                {{ submitted() ? 'Woche eingereicht' : 'Woche einreichen' }}
              </p-button>
            </div>
          </div>
          @if (validationError()) {
            <div class="text-red-600 mt-2">{{ validationError() }}</div>
          }

          <div style="margin-top: 2rem">
            <p-floatlabel>
              <textarea class="w-full my-4 p-10" pTextarea id="over-label" [(ngModel)]="weekText" rows="5" cols="50"
                        style="resize: none"></textarea>
              <label for="over-label">Beschreibe kurz deine Tätigkeiten dieser Woche (Aufgaben, Projekte,
                Besonderheiten, Probleme)</label>
            </p-floatlabel>
          </div>
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
          @defer (when forms().length != 0) {
            <tr [formGroup]="getFormGroup(i)" [class.weekend]="dateFormatService.isWeekend(day.date)">
              <td class="px-2 py-1">
                <div class="flex flex-col">
                  <span class="font-medium">{{ dateFormatService.getWeekdayName(day.date) }}</span>
                  <span class="text-sm text-gray-600">{{ dateFormatService.formatDate(day.date) }}</span>
                </div>
              </td>

              <td class="px-2 py-1">
                <p-select
                  class="w-full"
                  formControlName="presence"
                  [options]="presenceOptions()"
                  optionLabel="label"
                  optionValue="value"
                  [showClear]="true"
                  placeholder="Unbekannt"
                  ariaLabel="Anwesenheit"
                  fluid
                ></p-select>
              </td>

              <td class="px-2 py-1">
                <p-select
                  class="w-full"
                  formControlName="presenceLocation"
                  [options]="presenceTypeOptions()"
                  optionLabel="label"
                  optionValue="value"
                  [showClear]="true"
                  placeholder="Unbekannt"
                  ariaLabel="Ort"
                  fluid
                ></p-select>
              </td>

              <td class="px-2 py-1 text-right flex gap-1 flex-row">
                <p-input-number
                  class="text-right"
                  formControlName="hours"
                  [min]="0"
                  [max]="24"
                  [step]="1"
                  [showButtons]="true"
                  ariaLabel="Stunden"
                  fluid
                ></p-input-number>
                <p-input-number
                  class="text-right"
                  formControlName="minutes"
                  [min]="0"
                  [max]="59"
                  [step]="1"
                  [showButtons]="true"
                  ariaLabel="Minuten"
                  fluid
                ></p-input-number>
              </td>
            </tr>
          }
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`` + `:host ::ng-deep tr.weekend { background-color: rgba(0, 0, 0, 0.03); }`]
})
export class BookWeekComponent {
  public readonly bookWeek = input.required<BookWeek>();
  public forms = signal<FormGroup[]>([]);
  public isSaving = signal(false);
  public validationError = signal<string | null>(null);
  public readonly presenceOptions = computed(() => Object.values(Presence).map(v => ({
    value: v, label: PresenceDisplay.getPresenceDisplay(v as Presence)
  })));
  public readonly presenceTypeOptions = computed(() => Object.values(PresenceType).map(v => ({
    value: v, label: PresenceDisplay.getPresenceType(v as PresenceType)
  })));
  protected readonly dateFormatService = inject(DateFormatService);
  protected readonly weekText = signal<string>('');
  protected readonly submitted = signal(false);
  private readonly bookWeekStore = inject(BookWeekStore);
  private readonly bookStore = inject(BookStore);

  constructor() {
    effect(() => {
      const loading = this.bookWeekStore.loading();
      if (!loading && this.isSaving()) {
        this.isSaving.set(false);
        const error = this.bookWeekStore.error();
        this.validationError.set(error ? 'Fehler beim Speichern der Woche. Bitte versuchen Sie es erneut.' : null);
        if (!error) this.forms().forEach(f => f.markAsPristine());
      }
    });

    effect(() => {

      if (this.bookWeek().days === undefined) {
        return;
      }

      this.weekText.set(this.bookWeek().text);
      this.submitted.set(this.bookWeek().weekSubmitted);

      this.forms.set(this.bookWeek().days.map(d => BookDay.getFormGroup(d)));
    });
  }

  public onSave(): void {
    this.isSaving.set(true);
    const updatedDays = this.forms().map(f => ({
      id: f.get('id')!.value,
      date: f.get('date')!.value,
      presence: f.get('presence')!.value,
      presenceLocation: f.get('presenceLocation')!.value,
      hours: f.get('hours')!.value,
      minutes: f.get('minutes')!.value,
    }));

    const activeBook = this.bookStore.activeBook();
    if (!activeBook?.id) {
      this.validationError.set('Kein aktives Berichtsheft gefunden.');
      this.isSaving.set(false);
      return;
    }

    this.bookWeekStore.updateWeek(this.bookWeek().id, activeBook.id, this.weekText(), updatedDays);
  }

  protected getFormGroup(rowIndex: number): FormGroup {
    return this.forms()[rowIndex];
  }

  protected submitWeek() {
    this.bookWeekStore.setWeekUpdated(this.bookStore.activeBook().id, this.bookWeek().id);
  }
}
