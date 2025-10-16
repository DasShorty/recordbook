import {Component, computed, inject} from '@angular/core';
import {HeaderComponent} from '@shared/layout/header.component';
import {UserStore} from '@shared/users/user.store';
import {SidebarMenuComponent} from '@shared/layout/sidebar.menu.component';

@Component({
  selector: 'layout-component',
  imports: [
    HeaderComponent,
    SidebarMenuComponent
  ],
  template: `
    <div class="layout">
      <header-component [user]="activeUser()"/>
      <div class="flex flex-2 gap-4 flex-row h-full mt-4">
        <sidebar-menu-component class="bg-gray-100 rounded-br-md rounded-tr-md h-full"/>
        <ng-content class="bg-gray-100"></ng-content>
      </div>
    </div>
  `,
  styles: `
    .layout {
      height: 100vh;
    }
  `
})
export class LayoutComponent {

  private readonly userStore = inject(UserStore);
  protected readonly activeUser = computed(() => this.userStore.getActiveUser());

}
