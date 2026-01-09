import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {BookWeek} from '@features/book/models/book.week.model';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {DateFormatService} from '@features/book/services/date.format.service';
import {BookId} from '@features/book/models/book.model';
import {BookTrainerStore} from '@features/book/state/book.trainer.store';

@Component({
  selector: 'book-week-view-component',
  imports: [
    TableModule,
    Button,
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  template: `

    @if (bookWeek() == null) {
      <p>Book Week is null!</p>
    } @else {
      <p-table [value]="bookWeek()!!.days" [scrollable]="true" scrollHeight="flex" style="width:100%; height:100%;">
        <ng-template #caption>
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <p-button [queryParams]="{cw: this.getPreviousCalendarWeek(), year: this.getPreviousYear()}"
                        [routerLink]="'/record-book/manage/view/' + bookId().toString()">
                <
              </p-button>
              <p-button [queryParams]="{cw: this.getNextCalendarWeek(), year: this.getNextYear()}"
                        [routerLink]="'/record-book/manage/view/' + bookId().toString()">
                >
              </p-button>
            </div>
            <div class="text-xl font-bold">Woche {{ bookWeek()?.year }}/{{ bookWeek()?.calendarWeek }}</div>
            <div class="flex gap-2">
              <p-button (click)="signWeek()" [disabled]="isSigned() || !isLocked()">
                {{ loading() ? 'Saving...' : isSigned() ? 'Woche akzeptiert' : 'Woche aktzeptieren' }}
              </p-button>
              @if (!isSigned()) {
                <p-button severity="warn" (click)="denyWeek()" [disabled]="!isLocked()">
                  {{ loading() ? 'Saving...' : 'Woche ablehnen' }}
                </p-button>
              }
            </div>
          </div>

          <div style="margin-top: 2rem">
            <p>{{ bookWeek()?.text }}</p>
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
          <tr [class.weekend]="dateFormatService.isWeekend(day.date)">
            <td class="px-2 py-1">
              <div class="flex flex-col">
                <span class="font-medium">{{ dateFormatService.getWeekdayName(day.date) }}</span>
                <span class="text-sm text-gray-600">{{ dateFormatService.formatDate(day.date) }}</span>
              </div>
            </td>

            <td class="px-2 py-1">
              <p>{{ day.presence }}</p>
            </td>

            <td class="px-2 py-1">
              <p>{{ day.presenceLocation }}</p>
            </td>

            <td class="px-2 py-1 text-right">
              <p>{{ day.hours }}h {{ day.minutes }}min</p>
            </td>
          </tr>
        </ng-template>
      </p-table>
    }
  `
})
export class BookWeekViewComponent {

  public readonly bookId = input.required<BookId>();
  public readonly bookWeekInput = input.required<BookWeek>();
  public readonly bookWeek = signal<BookWeek | null>(null);
  protected isSigned = computed(() => this.bookWeek()!!.signedFromTrainer === null);
  protected isLocked = computed(() => this.bookWeek()?.locked);
  protected readonly dateFormatService = inject(DateFormatService);
  protected readonly loading = signal<boolean>(false);
  private readonly bookTrainerStore = inject(BookTrainerStore);

  constructor() {

    effect(() => {
      this.bookWeek.set(this.bookWeekInput());

      console.log("Woche " + this.isSigned());
    });

  }

  signWeek() {

    if (this.bookWeek() == null) {
      return;
    }

    this.loading.set(true);
    this.bookTrainerStore.acceptWeek(this.bookWeek()!!.id, res => {

      if (res.data != null) {
        this.bookWeek.set(res.data!!);
      }

      this.loading.set(false);
    });
  }

  getNextYear(): number {
    if (this.bookWeek()!!.calendarWeek === 52) {
      return this.bookWeek()!!.year + 1;
    }
    return this.bookWeek()!!.year;
  }

  getPreviousYear(): number {
    if (this.bookWeek()!!.calendarWeek === 1) {
      return this.bookWeek()!!.year - 1;
    }
    return this.bookWeek()!!.year;
  }

  getNextCalendarWeek(): number {
    if (this.bookWeek()!!.calendarWeek === 52) {
      return 1;
    }
    return this.bookWeek()!!.calendarWeek + 1;
  }

  getPreviousCalendarWeek(): number {
    if (this.bookWeek()!!.calendarWeek === 1) {
      return 52;
    }
    return this.bookWeek()!!.calendarWeek - 1;
  }

  protected denyWeek() {

  }
}
