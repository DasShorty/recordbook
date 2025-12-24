import {Component, computed, inject, input} from '@angular/core';
import {BookWeek} from '@features/book/models/book.week.model';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {DateFormatService} from '@features/book/services/date.format.service';

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

    <p-table>
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <p-button [queryParams]="{'cw': (this.bookWeek().calendarWeek - 1)}"
                      [routerLink]="'/record-book/manage/view/' + bookWeek().id">
              <
            </p-button>
            <p-button [queryParams]="{'cw': (this.bookWeek().calendarWeek + 1)}"
                      [routerLink]="'/record-book/manage/view/' + bookWeek().id">
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

          <td class="px-2 py-1 text-right flex gap-1 flex-row">
            <p>{{ day.hours }}h {{ day.minutes }}min</p>
          </td>
        </tr>
      </ng-template>
    </p-table>

  `
})
export class BookWeekViewComponent {

  public readonly bookWeek = input.required<BookWeek>();
  protected isSigned = computed(() => this.bookWeek().signedFromTrainer !== '');
  protected readonly dateFormatService = inject(DateFormatService);

  signWeek() {

  }

}
