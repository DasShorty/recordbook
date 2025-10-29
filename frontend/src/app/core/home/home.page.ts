import {Component, computed, inject} from '@angular/core';
import {UserStore} from '@core/users/state/user.store';
import {UserType} from '@core/users/models/users.model';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';

@Component({
  selector: 'home-page',
  imports: [
    LayoutComponent,
    BoxComponent
  ],
  template: `
    <layout-component>
      <div>
        <box-component>
          Test
          Test
        </box-component>
      </div>
    </layout-component>
  `
})
export class HomePage {

  protected readonly userStore = inject(UserStore);
  protected readonly userType = computed(() => {
    return this.userStore.getActiveUser().userType;
  });

  protected readonly UserType = UserType;
}
