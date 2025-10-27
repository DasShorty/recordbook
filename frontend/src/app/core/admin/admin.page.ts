import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {CompanyListComponent} from '@core/admin/components/company/company.list.component';
import {CompanyAddButton} from '@core/admin/components/company/company.add.button';
import {UsersListComponent} from '@core/admin/components/users/users.list.component';
import {UserAddButton} from '@core/admin/components/users/user.add.button';

@Component({
  selector: 'admin-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    CompanyListComponent,
    CompanyAddButton,
    UsersListComponent,
    UserAddButton
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
          <div class="flex justify-between">
            <h2>Benutzer Verwalten</h2>
            <user-add-button></user-add-button>
          </div>
          <users-list-component></users-list-component>
        </box-component>
      </div>
    </layout-component>
  `
})
export class AdminPage {
}
