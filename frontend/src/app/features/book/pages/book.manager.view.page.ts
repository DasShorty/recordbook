import {Component, computed, effect, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {Book} from '@features/book/models/book.model';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {BookWeekStore} from '@features/book/state/book.week.store';
import {BookWeekViewComponent} from '@features/book/components/week/book.week.view.component';
import {BookWeek} from '@features/book/models/book.week.model';

@Component({
  selector: 'book-manager-view-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    BookWeekViewComponent
  ],
  template: `
    <layout-component>
      <box-component>
        <h1>Manage Book from {{ book().trainee.forename }} {{ book().trainee.surname }}</h1>
        @defer (when currentWeek() != undefined) {
          <book-week-view-component [bookId]="book().id" [bookWeekInput]="currentWeek()!!"></book-week-view-component>
        } @placeholder {
          <div>Loading week data...</div>
        }
      </box-component>
    </layout-component>
  `
})
export class BookManagerViewPage {

  private readonly route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  book = computed(() => this.data()!!["book"] as Book);
  calendarWeek = computed(() => this.data()!!["calendarWeek"] as number);
  calendarYear = computed(() => this.data()!!["calendarYear"] as number);

  private readonly weekStore = inject(BookWeekStore);

  protected currentWeek = signal<BookWeek | undefined>(undefined);

  constructor() {
    effect(() => {
      const week = this.calendarWeek();
      const year = this.calendarYear();
      const bookId = this.book().id;

      this.weekStore.loadWeek(week, year, bookId).subscribe(value => {
        this.currentWeek.set(value);
      });
    });
  }

}
