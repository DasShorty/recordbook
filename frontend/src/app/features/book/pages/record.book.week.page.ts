import {Component, computed, inject, OnInit, signal, effect, ChangeDetectionStrategy} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {ActivatedRoute, Router} from '@angular/router';
import {WeekService} from '@features/book/services/week.service';
import {RecordBookWeekComponent} from '@features/book/components/record.book.week.component';
import {Optional} from '@shared/data/optional';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookStore} from '@features/book/state/book.store';
import {BookWeekStore} from '@features/book/state/book.week.store';

@Component({
  selector: 'record-book-week-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    RecordBookWeekComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <layout-component>
      <box-component>

        @if (this.week().isEmpty()) {

          <span>Kein Berichtsheft vorhanden. <br>Die Ausbildungskraft muss zuerst ein Berichtsheft für dich erstellen!</span>

        } @else {
          <record-book-week-component [recordBookWeek]="this.week().get()"></record-book-week-component>
        }

      </box-component>
    </layout-component>
  `
})
export class RecordBookWeekPage implements OnInit {

  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly weekService = inject(WeekService);
  private readonly currentWeek = signal<number | undefined>(undefined);
  private readonly bookStore = inject(BookStore);
  private readonly bookWeekStore = inject(BookWeekStore);

  protected readonly week = computed<Optional<BookWeek>>(() => {
    const bw = this.bookWeekStore.week();
    if (!bw) {
      return Optional.empty();
    }
    return Optional.of(bw);
  })

  constructor() {
    // when we have a book and a selected week, load the week
    effect(() => {
      const bookId = this.bookStore.activeBook().id;
      const cw = this.currentWeek();
      if (bookId && cw != undefined) {
        const year = new Date().getFullYear();
        this.bookWeekStore.getWeek(cw, year, bookId);
      }
    });
  }

  ngOnInit() {

    this.activeRoute.queryParams
      .subscribe(params => {

        const param = params['cw'];

        if (param === null || param === undefined) {

          this.router.navigateByUrl('/record-book/week?cw=' + this.weekService.getCurrentWeekNumber()).then();
          return;

        }

        this.currentWeek.set(Number(param));
        // ensure we have the user's book
        this.bookStore.getOwnBook();

      })

  }
}
