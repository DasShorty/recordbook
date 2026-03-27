import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SidebarMenuItem} from '@shared/layout/sidebar/sidebar.menu-item';

@Component({
  selector: 'sidebar-item-component',
  template: `
    <a [routerLink]="menuItem().routerLink" routerLinkActive="nav-active">
      <li class="sidebar-nav-item">
        <i [class]="menuItem().icon"></i>
        <span>
          {{ menuItem().label }}
        </span>
      </li>
    </a>
  `,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styles: `
    .sidebar-nav-item {

      a {

        cursor: pointer;
        padding: 1rem 0 1rem 1rem;
        transition: transform var(--layout-section-transition-duration),
        left var(--layout-section-transition-duration);
        border-radius: var(--content-border-radius);
        color: var(--text-color);

      }

      padding: 1rem 0 1rem 1rem;
      cursor: pointer;
      border-radius: 20px;
      color: var(--text-color);

      &:hover {
        background-color: var(--color-gray-100);
      }

      &:has(> a.nav-active) {
        font-weight: 700;
        color: var();
      }

    }
  `
})
class SidebarItemComponent {

  readonly menuItem = input.required<SidebarMenuItem>();

}

export default SidebarItemComponent
