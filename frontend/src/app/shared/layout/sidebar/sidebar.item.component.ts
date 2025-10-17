import {Component, input} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'sidebar-item-component',
  template: `
    <li class="sidebar-nav-item">
      <a [routerLink]="menuItem().routerLink" routerLinkActive="nav-active">
        <i [class]="menuItem().icon"></i>
        <span>
          {{ menuItem().label }}
        </span>
      </a>
    </li>
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
        background-color: var(--surface-hover);
      }

      &:has(> a.nav-active) {
        font-weight: 700;
        color: var();
      }

    }
  `
})
class SidebarItemComponent {

  readonly menuItem = input.required<MenuItem>();

}

export default SidebarItemComponent
