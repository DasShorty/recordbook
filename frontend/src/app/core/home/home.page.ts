import {Component, computed, inject} from '@angular/core';
import {UserStore} from '@shared/users/user.store';
import {UserType} from '@shared/users/users.model';
import {NavigationComponent} from '@shared/navigation/navigation.component';
import {LayoutComponent} from '@shared/layout/layout.component';

@Component({
  selector: 'home-page',
  imports: [
    NavigationComponent,
    LayoutComponent
  ],
  template: `

    <layout-component></layout-component>

    <h1>Protected Home Page</h1>

    <navigation-component></navigation-component>

  `
})
export class HomePage {

  protected readonly userStore = inject(UserStore);
  protected readonly userType = computed(() => {
    return this.userStore.getActiveUser().userType;
  });

  protected readonly UserType = UserType;
}
