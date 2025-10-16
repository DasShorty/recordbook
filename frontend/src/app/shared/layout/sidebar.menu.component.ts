import {Component} from '@angular/core';

@Component({
  selector: 'sidebar-menu-component',
  template: `
    <nav class="p-4 bg-gray-100 rounded-md box-border h-full">
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
