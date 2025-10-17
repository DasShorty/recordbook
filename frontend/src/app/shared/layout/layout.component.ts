import {Component, inject} from '@angular/core';
import {HeaderComponent} from '@shared/layout/header/header.component';
import {SidebarMenuComponent} from '@shared/layout/sidebar/sidebar.menu.component';
import {LayoutStore} from '@shared/layout/layout.store';

@Component({
  selector: 'layout-component',
  imports: [
    HeaderComponent,
    SidebarMenuComponent
  ],
  template: `
    <header-component/>
    <main>
      <sidebar-menu-component></sidebar-menu-component>
      <div [class]="this.layoutStore.isMenuVisible() ? 'content-margin' : ''">
        <ng-content></ng-content>
      </div>
    </main>
  `,
  styles: `

    main {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      margin: 1rem;
      box-sizing: border-box;
      height: 100%;
    }

    .content-margin {
      margin-left: 20.5rem;
    }

  `
})
export class LayoutComponent {

  protected readonly layoutStore = inject(LayoutStore);

}
