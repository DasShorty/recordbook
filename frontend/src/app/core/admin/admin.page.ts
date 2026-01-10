import {Component} from '@angular/core';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {UsersListComponent} from '@core/users/components/users.list.component';

@Component({
  selector: 'admin-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    UsersListComponent
  ],
  template: `
    <layout-component>
      <div class="columns">
        <box-component>
          <users-list-component></users-list-component>
        </box-component>
      </div>
    </layout-component>
  `
})
export class AdminPage {
}
