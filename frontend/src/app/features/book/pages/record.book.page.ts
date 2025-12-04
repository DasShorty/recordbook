import {Component, ChangeDetectionStrategy} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';

@Component({
  selector: 'record-book-page',
  imports: [
    LayoutComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <layout-component>



    </layout-component>
  `
})
export class RecordBookPage {
}
