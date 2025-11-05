import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {RecordBookManagerListComponent} from '@features/book/components/manager/record.book.manager.list.component';

@Component({
  selector: 'trainer-book-manager-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    RecordBookManagerListComponent
  ],
  template: `
    <layout-component>
      <box-component>
        <record-book-manager-list-component></record-book-manager-list-component>
      </box-component>
    </layout-component>
  `
})
export class TrainerBookManagerPage {
}
