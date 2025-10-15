import {Component} from '@angular/core';

@Component({
  selector: 'navigation-component',
  template: `
    <nav>
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
export class NavigationComponent {

}
