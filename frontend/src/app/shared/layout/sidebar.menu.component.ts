import {Component} from '@angular/core';

@Component({
  selector: 'sidebar-menu-component',
  template: `
    <nav class="p-4">
      <ul>
        <li>Dashboard</li>
        <li>
          <span>Berichtsheft</span>
          <ul>
            <li>Wochenansicht</li>
            <li>Jahresansicht</li>
            <li>Statistik</li>
          </ul>
        </li>
        <li>Azubi-Verwaltung</li>
        <li>Ausbilder-Verwaltung</li>
        <li>Unternehmens-Verwaltung</li>
      </ul>
    </nav>
  `
})
export class SidebarMenuComponent {



}
