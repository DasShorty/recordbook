import {Component, computed, inject} from '@angular/core';
import {HeaderComponent} from '@shared/layout/header.component';
import {UserStore} from '@shared/users/user.store';

@Component({
  selector: 'layout-component',
  imports: [
    HeaderComponent
  ],
  template: `
    <header-component [user]="activeUser()"/>
  `
})
export class LayoutComponent {

  private readonly userStore = inject(UserStore);
  protected readonly activeUser = computed(() => this.userStore.getActiveUser());

}
