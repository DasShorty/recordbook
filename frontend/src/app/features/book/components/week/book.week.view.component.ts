import {Component, computed, inject, input} from '@angular/core';
import {BookWeek} from '@features/book/models/book.week.model';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {DateFormatService} from '@features/book/services/date.format.service';
import {BookId} from '@features/book/models/book.model';

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

    <p-table [value]="bookWeek().days" [scrollable]="true" scrollHeight="flex" style="width:100%; height:100%;">
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
          <div class="text-xl font-bold">Woche {{ bookWeek().year }}/{{ bookWeek().calendarWeek }}</div>
          <div class="flex gap-2">
            <p-button (click)="signWeek()" [disabled]="!isSigned()">
              {{ !isSigned() ? 'Woche akzeptiert' : 'Woche aktzeptieren' }}
            </p-button>
          </div>
        </div>

        <div style="margin-top: 2rem">
          <p>{{ bookWeek().text }}</p>
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

  `
})
export class BookWeekViewComponent {

  public readonly bookId = input.required<BookId>();
  public readonly bookWeek = input.required<BookWeek>();
  protected isSigned = computed(() => this.bookWeek().signedFromTrainer !== '');
  protected readonly dateFormatService = inject(DateFormatService);

  signWeek() {

  }

  getNextYear(): number {
    if (this.bookWeek().calendarWeek === 52) {
      return this.bookWeek().year + 1;
    }
    return this.bookWeek().year;
  }

  getPreviousYear(): number {
    if (this.bookWeek().calendarWeek === 1) {
      return this.bookWeek().year - 1;
    }
    return this.bookWeek().year;
  }

  getNextCalendarWeek(): number {
    if (this.bookWeek().calendarWeek === 52) {
      return 1;
    }
    return this.bookWeek().calendarWeek + 1;
  }

  getPreviousCalendarWeek(): number {
    if (this.bookWeek().calendarWeek === 1) {
      return 52;
    }
    return this.bookWeek().calendarWeek - 1;
  }

}
