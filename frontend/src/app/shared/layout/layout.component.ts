import {Component} from '@angular/core';
import {HeaderComponent} from '@shared/layout/header/header.component';
import {SidebarMenuComponent} from '@shared/layout/sidebar/sidebar.menu.component';

@Component({
  selector: 'layout-component',
  imports: [
    HeaderComponent,
    SidebarMenuComponent
  ],
  template: `
    <header-component/>
    <sidebar-menu-component></sidebar-menu-component>
    <main>
      <ng-content></ng-content>
    </main>
  `
})
export class LayoutComponent {


}
