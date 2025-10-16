import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {SidebarGroupComponent} from '@shared/layout/sidebar/sidebar.group.component';

@Component({
  selector: 'sidebar-menu-component',
  imports: [
    SidebarGroupComponent
  ],
  template: `
    <nav class="p-4 bg-white rounded-md box-border h-full">
      <ul>
        @for (item of model; track item.automationId) {
          <sidebar-group-component [menuItem]="item"></sidebar-group-component>
        }
      </ul>
    </nav>
  `,
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
        {label: 'Wochenansicht', icon: 'pi pi-file-arrow-up', routerLink: ['/']},
        {label: 'Jahresansicht', icon: 'pi pi-file-arrow-up', routerLink: ['/']},
        {label: 'Statistik', icon: 'pi pi-file-arrow-up', routerLink: ['/']},
      ]
    },
    {
      label: 'Administration', items: [
        {label: 'Trainees', icon: 'pi pi-file-arrow-up', routerLink: ['/']},
        {label: 'Trainers', icon: 'pi pi-file-arrow-up', routerLink: ['/']},
        {label: 'Company-Management', icon: 'pi pi-file-arrow-up', routerLink: ['/']}
      ]
    },
  ]


}
