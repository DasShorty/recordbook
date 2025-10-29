import {Component, inject, input} from '@angular/core';
import {WeekService} from '@features/book/services/week.service';
import {TableModule} from 'primeng/table';
import {BookWeek} from '@features/book/models/book.week.model';

@Component({
  selector: 'record-book-week-component',
  imports: [
    TableModule
  ],
  template: `
    <p-table [value]="recordBookWeek().days">

      <ng-template #caption>

        <div class="flex items-center justify-items-start">
          <span class="text-xl font-bold">Woche {{ recordBookWeek().year }}/{{ recordBookWeek().calendarWeek }}</span>
        </div>

      </ng-template>

    </p-table>
  `
})
export class RecordBookWeekComponent {

  public readonly recordBookWeek = input.required<BookWeek>();
  private readonly weekService = inject(WeekService);


}
