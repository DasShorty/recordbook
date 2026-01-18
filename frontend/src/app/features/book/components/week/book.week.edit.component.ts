import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekFormService} from '@features/book/services/book.week.form.service';
import {BookWeekNavigationService} from '@features/book/services/book.week.navigation.service';
import {FloatLabel} from 'primeng/floatlabel';
import {Textarea} from 'primeng/textarea';
import {BookWeekEditRowComponent} from './rows/book.week.edit.row.component';
import {BookWeekEditHeaderComponent} from './headers/book.week.edit.header.component';

@Component({
  selector: 'book-week-edit-component',
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    FloatLabel,
    Textarea,
    BookWeekEditRowComponent,
    BookWeekEditHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex flex-col">
      <book-week-edit-header
        [calendarWeek]="bookWeek().calendarWeek"
        [year]="bookWeek().year"
        [isSubmitted]="submitted()"
        [isSaving]="isSaving()"
        [error]="validationError()"
        [previousWeekParams]="previousWeekParams()"
        [nextWeekParams]="nextWeekParams()"
        (onSave)="onSave()"
        (onSubmit)="submitWeek()"
      ></book-week-edit-header>

      <div class="flex-none px-4 py-4">
        <p-floatlabel>
          <textarea
            [disabled]="submitted()"
            class="w-full"
            pTextarea
            id="over-label"
            [(ngModel)]="weekText"
            rows="5"
            style="resize: none"
          ></textarea>
          <label for="over-label">Beschreibe kurz deine Tätigkeiten dieser Woche (Aufgaben, Projekte, Besonderheiten,
            Probleme)</label>
        </p-floatlabel>
      </div>

      <div class="flex-1 overflow-hidden">
        <p-table
          [value]="bookWeek().days"
          [scrollable]="true"
          scrollHeight="flex"
          class="p-datatable-striped"
          [tableStyle]="{ 'width': '100%', 'height': '100%' }"
        >
          <ng-template #header>
            <tr>
              <th>Tag / Datum</th>
              <th>Anwesenheit</th>
              <th>Ort</th>
              <th>Stunden</th>
            </tr>
          </ng-template>

          <ng-template #body let-day let-i="rowIndex">
            @defer (when forms().length > 0) {
              <tr book-week-edit-row
                  [bookDay]="day"
                  [formGroup]="getFormGroup(i)"
              ></tr>
            }
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-datatable .p-datatable-tbody > tr.weekend {
          background-color: rgba(0, 0, 0, 0.03);
        }

        .p-datatable .p-datatable-tbody > tr > td {
          padding: 0.5rem;
        }
      }
    `,
  ],
})
export class BookWeekEditComponent {

  public readonly bookWeek = input.required<BookWeek>();
  public readonly trainerView = input<boolean>(false);

  public forms = signal<FormGroup[]>([]);
  public isSaving = signal(false);
  public validationError = signal<string | null>(null);
  public weekText = signal<string>('');
  public submitted = signal(false);

  private readonly bookWeekStore = inject(BookWeekStore);
  private readonly bookStore = inject(BookStore);
  private readonly formService = inject(BookWeekFormService);
  private readonly navigationService = inject(BookWeekNavigationService);

  public previousWeekParams = computed(() => {

    const week = this.bookWeek();

    if (!week) return {cw: 1, year: new Date().getFullYear()};

    const prev = this.navigationService.getPreviousWeek(
      week.calendarWeek,
      week.year
    );
    return {cw: prev.week, year: prev.year};
  });
  public nextWeekParams = computed(() => {

    const week = this.bookWeek();

    if (!week) return { cw: 1, year: new Date().getFullYear() };

    const next = this.navigationService.getNextWeek(
      week.calendarWeek,
      week.year
    );
    return {cw: next.week, year: next.year};
  });

  constructor() {
    effect(() => {
      const loading = this.bookWeekStore.loading();
      if (!loading && this.isSaving()) {
        this.isSaving.set(false);
        const error = this.bookWeekStore.error();
        this.validationError.set(
          error
            ? 'Fehler beim Speichern der Woche. Bitte versuchen Sie es erneut.'
            : null
        );
        if (!error) {
          this.forms().forEach((f) => f.markAsPristine());
        }
      }
    });

    effect(() => {
      if (this.bookWeek().days === undefined) {
        return;
      }

      this.weekText.set(this.bookWeek().text);
      this.submitted.set(this.bookWeek().locked);

      const formGroups = this.formService.createFormGroupsForWeek(
        this.bookWeek().days,
        this.bookWeek().locked
      );
      this.forms.set(formGroups);
    });
  }

  public onSave(): void {
    try {
      const activeBook = this.bookStore.activeBook();
      if (!activeBook?.id) {
        this.validationError.set('Kein aktives Berichtsheft gefunden.');
        return;
      }

      const payload = this.formService.createUpdatePayload(
        this.bookWeek().id,
        activeBook.id,
        this.weekText(),
        this.forms()
      );

      this.isSaving.set(true);
      this.validationError.set(null);

      const bookDays = this.formService.bookDayFormValuesToBookDays(payload.days);

      this.bookWeekStore.updateWeek(
        payload.weekId,
        payload.bookId,
        payload.text,
        bookDays
      );
    } catch (error) {
      this.validationError.set(
        error instanceof Error
          ? error.message
          : 'Ein unerwarteter Fehler ist aufgetreten.'
      );
      this.isSaving.set(false);
    }
  }

  public submitWeek(): void {
    this.bookWeekStore.submitWeekToTrainer(this.bookWeek().id);
  }

  protected getFormGroup(rowIndex: number): FormGroup {
    return this.forms()[rowIndex];
  }
}
