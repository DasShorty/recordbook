import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {BookWeek} from '@features/book/models/book.week.model';
import {TableModule} from 'primeng/table';
import {BookId} from '@features/book/models/book.model';
import {BookTrainerStore} from '@features/book/state/book.trainer.store';
import {BookWeekNavigationService} from '@features/book/services/book.week.navigation.service';
import {CommonModule} from '@angular/common';
import {BookWeekViewRowComponent} from './rows/book.week.view.row.component';
import {BookWeekViewHeaderComponent} from './headers/book.week.view.header.component';

@Component({
  selector: 'book-week-view-component',
  imports: [
    CommonModule,
    TableModule,
    BookWeekViewRowComponent,
    BookWeekViewHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex flex-col">
      @if (bookWeek() === null) {
        <div class="flex items-center justify-center h-full">
          <p class="text-gray-500">Woche konnte nicht geladen werden</p>
        </div>
      } @else {
        <book-week-view-header
          [calendarWeek]="bookWeek()!.calendarWeek"
          [year]="bookWeek()!.year"
          [isSigned]="isSigned()"
          [isLocked]="isLocked()"
          [isLoading]="isLoading()"
          [error]="error()"
          [previousWeekParams]="previousWeekParams()"
          [nextWeekParams]="nextWeekParams()"
          [routerLinkBase]="'/record-book/manage/view/' + bookId().toString()"
          (onSign)="signWeek()"
          (onDeny)="denyWeek()"
        ></book-week-view-header>

        <div class="flex-none px-4 py-4 border-b border-gray-200">
          <div class="text-sm text-gray-600 leading-relaxed">
            {{ bookWeek()!.text }}
          </div>
        </div>

        <div class="flex-1 overflow-hidden">
          <p-table
            [value]="bookWeek()!.days"
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

            <ng-template #body let-day>
              <tr book-week-view-row [bookDay]="day"></tr>
            </ng-template>
          </p-table>
        </div>
      }
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
export class BookWeekViewComponent {

  public readonly bookId = input.required<BookId>();
  public readonly bookWeekInput = input.required<BookWeek>();

  public bookWeek = signal<BookWeek | null>(null);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  public isSigned = computed(() => this.bookWeek()?.signedFromTrainer !== null);
  public isLocked = computed(() => this.bookWeek()?.locked ?? false);

  private readonly bookTrainerStore = inject(BookTrainerStore);
  private readonly navigationService = inject(BookWeekNavigationService);
  public previousWeekParams = computed(() => {
    const week = this.bookWeek();
    if (!week) {
      return {cw: 1, year: new Date().getFullYear()};
    }
    const prev = this.navigationService.getPreviousWeek(
      week.calendarWeek,
      week.year
    );
    return {cw: prev.week, year: prev.year};
  });
  public nextWeekParams = computed(() => {
    const week = this.bookWeek();
    if (!week) {
      return {cw: 1, year: new Date().getFullYear()};
    }
    const next = this.navigationService.getNextWeek(
      week.calendarWeek,
      week.year
    );
    return {cw: next.week, year: next.year};
  });

  constructor() {
    effect(() => {
      this.bookWeek.set(this.bookWeekInput());
    });
  }

  public signWeek(): void {
    const week = this.bookWeek();
    if (!week) {
      this.error.set('Woche konnte nicht gefunden werden');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.bookTrainerStore.acceptWeek(week.id, (res) => {
      this.isLoading.set(false);
      if (res.ok && res.data) {
        this.bookWeek.set(res.data);
      } else {
        this.error.set('Fehler beim Akzeptieren der Woche. Bitte versuchen Sie es erneut.');
      }
    });
  }

  public denyWeek(): void {
    const week = this.bookWeek();
    if (!week) {
      this.error.set('Woche konnte nicht gefunden werden');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.bookTrainerStore.denyWeek(week.id, (res) => {
      this.isLoading.set(false);
      if (res.ok && res.data) {
        this.bookWeek.set(res.data);
      } else {
        this.error.set('Fehler beim Ablehnen der Woche. Bitte versuchen Sie es erneut.');
      }
    });
  }
}
