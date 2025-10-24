import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {CompanyListComponent} from '@core/admin/components/company/company.list.component';
import {CompanyAddButton} from '@core/admin/components/company/company.add.button';

@Component({
  selector: 'admin-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    CompanyListComponent,
    CompanyAddButton
  ],
  template: `
    <layout-component>
      <div class="columns">
        <box-component>
          <div class="flex justify-between">
            <h2>Unternehmen Verwalten</h2>
            <company-add-button></company-add-button>
          </div>
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
