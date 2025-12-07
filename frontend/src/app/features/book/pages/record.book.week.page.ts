import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {ActivatedRoute, Router} from '@angular/router';
import {WeekService} from '@features/book/services/week.service';
import {BookWeekComponent} from '@features/book/components/book.week.component';
import {Optional} from '@shared/data/optional';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekStore} from '@features/book/state/book.week.store';

@Component({
  selector: 'record-book-week-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    BookWeekComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <layout-component>
      <box-component>

        @if (this.week().isEmpty()) {

          <span>Kein Berichtsheft vorhanden. <br>Die Ausbildungskraft muss zuerst ein Berichtsheft für dich erstellen!</span>

        } @else {
          <book-week-component [bookWeek]="this.week().get()"></book-week-component>
        }

      </box-component>
    </layout-component>
  `
})
export class RecordBookWeekPage implements OnInit {

  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly weekService = inject(WeekService);
  private readonly bookStore = inject(BookStore);
  private readonly bookWeekStore = inject(BookWeekStore);

  protected readonly week = computed<Optional<BookWeek>>(() => {
    const bw = this.bookWeekStore.week();
    if (!bw) {
      return Optional.empty();
    }
    return Optional.of(bw);
  })

  ngOnInit() {

    this.activeRoute.queryParams
      .subscribe(params => {

        const calendarWeek = params['cw'];

        if (calendarWeek === null || calendarWeek === undefined) {

          this.router.navigateByUrl('/record-book/week?cw=' + this.weekService.getCurrentWeekNumber()).then();
          return;

        }

        this.bookStore.getOwnBook(value => {
          const year = new Date().getFullYear();
          this.bookWeekStore.getWeek(calendarWeek, year, value.id);
        });

      })

  }
}
