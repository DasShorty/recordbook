import {Component, input} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'sidebar-item-component',
  template: `
    <li>
      <a [routerLink]="menuItem().routerLink" class="sidebar-nav-item">
        <i [class]="menuItem().icon"></i>
        <span>
          {{ menuItem().label }}
        </span>
      </a>
    </li>
  `,
  imports: [
    RouterLink
  ],
  styles: `
    .sidebar-nav-item {

      cursor: pointer;
      padding: 1rem 0 1rem 1rem;
      transition: transform var(--layout-section-transition-duration),
      left var(--layout-section-transition-duration);
      border-radius: var(--content-border-radius);
      color: var(--text-color);

      &:hover {
        background-color: var(--surface-hover);
      }

    }
  `
})
class SidebarItemComponent {

  readonly menuItem = input.required<MenuItem>();

}

export default SidebarItemComponent
