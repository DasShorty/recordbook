import {Component, computed, effect, inject} from '@angular/core';
import {HeaderComponent} from '@shared/layout/header.component';
import {UserStore} from '@shared/users/user.store';
import {SidebarMenuComponent} from '@shared/layout/sidebar/sidebar.menu.component';

@Component({
  selector: 'layout-component',
  imports: [
    HeaderComponent,
    SidebarMenuComponent
  ],
  template: `
    <div class="layout">
      <header-component/>
      <div class="content">
        <sidebar-menu-component class="sidebar box-border h-full"></sidebar-menu-component>
        <main class="main">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .layout {
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .content {
      display: grid;
      grid-template-columns: 20% 1fr;
      gap: 1rem;
      align-items: stretch;
      min-height: 0;
      margin: 1rem;
    }

    .sidebar {
      height: 100%;
    }

    .main {
      height: 100%;
      overflow: auto;
      padding: 1rem;
      box-sizing: border-box;
      min-height: 0;
    }
  `
})
export class LayoutComponent {

  private readonly userStore = inject(UserStore);
}
