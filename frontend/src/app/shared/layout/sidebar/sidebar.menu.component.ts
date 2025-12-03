import {Component, computed, inject} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {SidebarGroupComponent} from '@shared/layout/sidebar/sidebar.group.component';
import {LayoutStore} from '@shared/layout/layout.store';
import {NgClass} from '@angular/common';

@Component({
  selector: 'sidebar-menu-component',
  imports: [
    SidebarGroupComponent,
    NgClass
  ],
  template: `
    <nav class="sidebar-navigation" [ngClass]="isMenuOpen() ? '' : 'menu-invisible'">
      <ul>
        @for (item of model; track item) {
          <sidebar-group-component [menuItem]="item"></sidebar-group-component>
        }
      </ul>
    </nav>
  `,
  styles: `
    .sidebar-navigation {

      position: fixed;
      width: 20rem;
      overflow: hidden !important;
      opacity: 1;
      transition: transform 0.3s, left 0.3s;
      background-color: white;
      padding: 1rem;
      box-sizing: border-box;
      height: 100dvh;
      border-radius: 5px;

    }

    .menu-invisible {
      transform: translateX(-20rem) !important;
      opacity: 0 !important;
      display: none;
    }
  `
})
export class SidebarMenuComponent {

  model: MenuItem[] = [
    {
      label: 'Home', items: [
        {label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard']}
      ]
    },
    {
      label: 'Berichtsheft', items: [
        {label: 'Wochenansicht', icon: 'pi pi-file-arrow-up', routerLink: ['/record-book/week']},
        {label: 'Verwalten', icon: 'pi pi-file-arrow-up', routerLink: ['/record-book/manage']},
      ]
    },
    {
      label: 'Administration', items: [
        {label: 'Admin', icon: 'pi pi-file-arrow-up', routerLink: ['/admin']}
      ]
    },
  ];

  private readonly layoutStore = inject(LayoutStore);
  protected readonly isMenuOpen = computed(() => this.layoutStore.isMenuVisible());

}
