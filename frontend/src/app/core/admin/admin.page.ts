import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {UsersListComponent} from '@core/users/components/users.list.component';
import {UserAddButton} from '@core/users/components/user.add.button';

@Component({
  selector: 'admin-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    UsersListComponent,
    UserAddButton
  ],
  template: `
    <layout-component>
      <div class="columns">
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
