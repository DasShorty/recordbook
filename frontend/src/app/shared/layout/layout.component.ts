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
    <header-component></header-component>
    <main [class.menu-open]="layoutStore.isMenuVisible()">
      <sidebar-menu-component [class.collapsed]="!layoutStore.isMenuVisible()"></sidebar-menu-component>
      <div class="content">
        <ng-content></ng-content>
      </div>
    </main>
  `,
  styles: `

    :host {
      display: block;
      height: 100dvh;
      width: 100dvw;
      box-sizing: border-box;
      overflow: hidden;
    }

    main {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      padding: 1rem;
      box-sizing: border-box;
      margin-top: 4rem;
      height: calc(100vh - 4rem);
      overflow: hidden;
    }

    sidebar-menu-component {
      transition: width 0.25s ease, flex-basis 0.25s ease, padding 0.2s ease, opacity 0.25s ease;
      flex: 0 0 20rem;
      width: 20rem;
      box-sizing: border-box;
    }

    main:not(.menu-open) sidebar-menu-component,
    sidebar-menu-component.collapsed {
      flex: 0 0 0;
      width: 0;
      padding: 0;
      opacity: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .content {
      flex: 1 1 auto;
      overflow: auto;
      min-width: 0;
    }

  `
})
export class LayoutComponent {

  protected readonly layoutStore = inject(LayoutStore);

}
