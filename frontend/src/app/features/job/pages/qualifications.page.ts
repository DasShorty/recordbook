import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {QualificationsListComponent} from '@features/job/components/qualification/qualifications.list.component';

@Component({
  selector: 'qualifications-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    QualificationsListComponent
  ],
  template: `
    <layout-component>
      <box-component>
        <qualifications-list-component></qualifications-list-component>
      </box-component>
    </layout-component>
  `
})
export class QualificationsPage {
}
