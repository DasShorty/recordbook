import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {TableModule} from 'primeng/table';
import {BookWeek} from '@features/book/models/book.week.model';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'book-week',
  imports: [TableModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-table [value]="bookWeek().days">
      <ng-template #caption>
        <div class="flex items-center justify-items-start">
          <span class="text-xl font-bold">
            Woche {{ bookWeek().year }}/{{ bookWeek().calendarWeek }}
          </span>
        </div>
      </ng-template>

      <ng-template #header>
        <tr>
          <th>Anwesenheit</th>
          <th>Ort</th>
          <th>Qualifikationen</th>
          <th>Stunden</th>
        </tr>
      </ng-template>

      <ng-template #body let-day>
        {{ day | json }}
      </ng-template>
    </p-table>
  `,
})
export class BookWeekComponent {
  public readonly bookWeek = input.required<BookWeek>();
}

