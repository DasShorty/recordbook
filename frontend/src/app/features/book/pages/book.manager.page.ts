import {Component, ChangeDetectionStrategy} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {BookManagerListComponent} from '@features/book/components/manager/book.manager.list.component';

@Component({
  selector: 'book-manager-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    BookManagerListComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <layout-component>
      <box-component>
        <book-manager-list></book-manager-list>
      </box-component>
    </layout-component>
  `
})
export class BookManagerPage {
}

