import {Component, computed, input} from '@angular/core';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {AdvancedUserBody} from '@shared/users/users.model';
import {Avatar} from 'primeng/avatar';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'header-component',
  imports: [
    Button,
    Menu,
    Avatar,
    Ripple
  ],
  template: `
    <header class="flex flex-2 justify-between align-center p-4 bg-gray-100">
      <div>
        <p>LOGO</p>
      </div>
      <div>
        <p-button severity="secondary" (click)="toggleAccountMenu(menu, $event)">
          <i class="pi pi-user" style="font-size: 1.3rem;"></i>
        </p-button>
        <p-menu #menu appendTo="body" [model]="this.items" [popup]="true">
          <ng-template #end>
            <button pRipple
                    class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
              <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" class="mr-2" shape="circle"/>
              <span class="inline-flex flex-col">
                    <span class="font-bold">{{ this.userName() }}</span>
                    <span class="text-sm">{{ this.userType() }}</span>
                </span>
            </button>
          </ng-template>
        </p-menu>
      </div>
    </header>
  `
})
export class HeaderComponent {

  protected items: MenuItem[] = [
    {
      label: 'Account Details'
    },
    {
      label: 'View Company'
    },
    {
      label: 'Logout',

    }
  ];

  public user = input.required<AdvancedUserBody>();
  protected userName = computed(() => this.user().forename + " " + this.user().surname);
  protected userType = computed(() => this.user().userType);

  protected toggleAccountMenu(menu: Menu, event: Event) {
    menu.toggle(event);
  }

}
