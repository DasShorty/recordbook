import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {BookWeeksComponent} from '@features/book/components/book/book-weeks.component';

@Component({
  selector: 'book-year-overview-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    BookWeeksComponent
  ],
  template: `
    <layout-component>
      <box-component>
        <book-weeks-component></book-weeks-component>
      </box-component>
    </layout-component>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    box-component {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    box-component ::ng-deep > div {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `
})
export class BookYearOverviewPage {
}
