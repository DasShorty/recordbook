import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {JobListComponent} from '@features/job/components/job.list.component';

@Component({
  selector: 'job-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    JobListComponent
  ],
  template: `
    <layout-component>
      <box-component>
        <job-list-component></job-list-component>
      </box-component>
    </layout-component>
  `
})
export class JobPage {
}
