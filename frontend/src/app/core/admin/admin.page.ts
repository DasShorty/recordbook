import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {CompanyListComponent} from '@core/admin/components/company.list.component';

@Component({
  selector: 'admin-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    CompanyListComponent
  ],
  template: `
    <layout-component>
      <div class="columns">
        <box-component>
          <h2>Unternehmen Verwalten</h2>
          <company-list-component></company-list-component>
        </box-component>
        <box-component>
          <h2>Ausbildungskräfte Verwalten</h2>
        </box-component>
        <box-component>
          <h2>Azubis Verwalten</h2>
        </box-component>
      </div>
    </layout-component>
  `
})
export class AdminPage {
}
