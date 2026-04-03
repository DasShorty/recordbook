import {Component} from '@angular/core';
import SidebarNavComponent from '@core/layout/sidebar-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarNavComponent],
  template: `<sidebar-nav></sidebar-nav>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
    `,
  ],
})
export default class LayoutPage {}

