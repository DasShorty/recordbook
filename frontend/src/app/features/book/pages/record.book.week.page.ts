import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {WeekService} from '@features/book/services/week.service';
import {RecordBookWeekComponent} from '@features/book/components/record.book.week.component';
import {Optional} from '@shared/data/optional';
import {BookWeek} from '@features/book/models/book.week.model';
import {Button} from 'primeng/button';
import {BookStore} from '@features/book/state/book.store';

@Component({
  selector: 'record-book-week-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    RecordBookWeekComponent,
    Button
  ],
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
  private readonly bookStore = inject(BookStore);
  private readonly currentWeek = signal<number | undefined>(undefined);
  protected readonly week = computed<Optional<BookWeek>>(() => {

    if (this.currentWeek() == undefined) {
      return Optional.empty();
    }

    return Optional.empty();

  })

  ngOnInit() {

    this.activeRoute.queryParams
      .subscribe(params => {

        const param = params['cw'];

        if (param === null || param === undefined) {

          this.router.navigateByUrl('/record-book/week?cw=' + this.weekService.getCurrentWeekNumber()).then();
          return;

        }

        this.currentWeek.set(param);

      })

  }
}
