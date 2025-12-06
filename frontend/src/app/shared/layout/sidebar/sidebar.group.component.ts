import {Component, input} from '@angular/core';
import {MenuItem} from 'primeng/api';
import SidebarItemComponent from '@shared/layout/sidebar/sidebar.item.component';

@Component({
  selector: 'sidebar-group-component',
  template: `
    <li class="sidebar-nav-group">
      <div>
        {{ menuItem().label }}
      </div>
      <ul class="mt-2 mb-2">
        @for (item of menuItem().items; track item) {
          @if (item.visible) {
            <sidebar-item-component [menuItem]="item"></sidebar-item-component>
          }
        }
      </ul>
    </li>
  `,
  imports: [
    SidebarItemComponent
  ],
  styles: `
    .sidebar-nav-group {

      div {
        font-size: 0.857rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--text-color);
        margin: 0.75rem 0;
      }
    }
  `
})
export class SidebarGroupComponent {

  readonly menuItem = input.required<MenuItem>();

}
