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
        @for (item of model; track item.automationId) {
          <sidebar-group-component [menuItem]="item"></sidebar-group-component>
        }
      </ul>
    </nav>
  `,
  styles: `
    .sidebar-navigation {

      opacity: 1;
      transition: transform 0.3s, left 0.3s;

    }

    .menu-invisible {
      transform: translateX(-20rem) !important;
      opacity: 0 !important;
    }
  `
})
export class SidebarMenuComponent {

  model: MenuItem[] = [
    {
      label: 'Home', items: [
        {label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/']}
      ]
    },
    {
      label: 'Berichtsheft', items: [
        {label: 'Wochenansicht', icon: 'pi pi-file-arrow-up', routerLink: ['/record-book']},
        {label: 'Jahresansicht', icon: 'pi pi-file-arrow-up', routerLink: ['/record-book']},
        {label: 'Statistik', icon: 'pi pi-file-arrow-up', routerLink: ['/record-book']},
      ]
    },
    {
      label: 'Administration', items: [
        {label: 'Azubis', icon: 'pi pi-file-arrow-up', routerLink: ['/']},
        {label: 'Ausbildungskraft', icon: 'pi pi-file-arrow-up', routerLink: ['/']},
        {label: 'Unternehmen', icon: 'pi pi-file-arrow-up', routerLink: ['/']}
      ]
    },
  ];

  private readonly layoutStore = inject(LayoutStore);
  protected readonly isMenuOpen = computed(() => this.layoutStore.isMenuVisible());

}
