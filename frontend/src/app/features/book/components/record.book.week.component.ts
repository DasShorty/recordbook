import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {TableModule} from 'primeng/table';
import {BookWeek} from '@features/book/models/book.week.model';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'record-book-week-component',
  imports: [TableModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-table [value]="recordBookWeek().days">
      <ng-template #caption>
        <div class="flex items-center justify-items-start">
          <span class="text-xl font-bold">
            Woche {{ recordBookWeek().year }}/{{ recordBookWeek().calendarWeek }}
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
export class RecordBookWeekComponent {
  // prefer a signal-wrapped input to follow core/users style
  public readonly recordBookWeek = input.required<BookWeek>();
}
