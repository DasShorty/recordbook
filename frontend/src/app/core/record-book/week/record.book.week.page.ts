import {Component, inject, OnInit} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {WeekService} from '@shared/record-book/week.service';

@Component({
  selector: 'record-book-week-page',
  imports: [
    LayoutComponent,
    BoxComponent
  ],
  template: `
    <layout-component>
      <box-component>
        <h1></h1>
      </box-component>
    </layout-component>
  `
})
export class RecordBookWeekPage implements OnInit {

  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly weekService = inject(WeekService);

  ngOnInit() {

    this.activeRoute.queryParams
      .subscribe(params => {

        const param = params['cw'];

        if (param === null || param === undefined) {

          this.router.navigateByUrl('/record-book/week?cw=' + this.weekService.getCurrentWeekNumber()).then();

        }

      })

  }

}
