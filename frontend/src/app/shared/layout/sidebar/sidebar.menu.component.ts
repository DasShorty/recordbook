import {Component, computed, inject} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {SidebarGroupComponent} from '@shared/layout/sidebar/sidebar.group.component';
import {LayoutStore} from '@shared/layout/layout.store';
import {NgClass} from '@angular/common';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

@Component({
  selector: 'sidebar-menu-component',
  imports: [
    SidebarGroupComponent,
    NgClass
  ],
  template: `
    <nav class="sidebar-navigation" [ngClass]="isMenuOpen() ? '' : 'menu-invisible'">
      <ul>
        @for (item of menuItems(); track item) {
          @if (item.visible) {
            <sidebar-group-component [menuItem]="item"></sidebar-group-component>
          }
        }
      </ul>
    </nav>
  `,
  styles: `
    .sidebar-navigation {
      /* participate in layout instead of being fixed */
      position: relative;
      width: 20rem;
      overflow: hidden !important;
      opacity: 1;
      transition: width 0.3s ease, opacity 0.3s ease, padding 0.2s ease;
      background-color: white;
      padding: 1rem;
      box-sizing: border-box;
      height: 100%;
      border-radius: 5px;
    }

    /* fully hide sidebar when collapsed */
    .menu-invisible {
      width: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
  `
})
export class SidebarMenuComponent {

  protected readonly menuItems = computed(() => {
    return [
      {
        label: 'Home', visible: true, items: [
          {label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'], visible: true}
        ]
      },
      {
        label: 'Berichtsheft', visible: true, items: [
          {
            label: 'Wochenansicht',
            icon: 'pi pi-file-arrow-up',
            routerLink: ['/record-book/week'],
            visible: this.isUserTrainee()
          },
          {
            label: 'Übersicht',
            icon: 'pi pi-file-arrow-up',
            routerLink: ['/record-book/overview'],
            visible: this.isUserTrainee() || this.isUserTrainer() || this.isUserAdmin()
          },
          {
            label: 'Verwalten',
            icon: 'pi pi-file-arrow-up',
            routerLink: ['/record-book/manage'],
            visible: this.isUserTrainer() || this.isUserAdmin()
          },
        ]
      },
      {
        visible: this.isUserAdmin(),
        label: 'Administration',
        items: [
          {label: 'Admin', icon: 'pi pi-file-arrow-up', visible: this.isUserAdmin(), routerLink: ['/admin']}
        ]
      },
    ] as MenuItem[];
  })

  private readonly layoutStore = inject(LayoutStore);
  protected readonly isMenuOpen = computed(() => this.layoutStore.isMenuVisible());

  private readonly userStore = inject(UserStore);

  isUserAdmin() {
    return this.userStore.activeUser().authority === Authority.ADMINISTRATOR;
  }

  isUserTrainer() {
    return this.userStore.activeUser().authority === Authority.TRAINER;
  }

  isUserTrainee() {
    return this.userStore.activeUser().authority === Authority.TRAINEE;
  }

}
