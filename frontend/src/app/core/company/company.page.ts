import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';

@Component({
  selector: 'company-page',
  imports: [
    LayoutComponent,
    BoxComponent
  ],
  template: `
    <layout-component>
      <div class="columns">
        <box-component>
          <h1>Unternehmen</h1>
        </box-component>
      </div>
    </layout-component>
  `
})
export class CompanyPage {
}
