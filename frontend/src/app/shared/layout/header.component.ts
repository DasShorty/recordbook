import {Component, computed, inject, input} from '@angular/core';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {AdvancedUserBody} from '@shared/users/users.model';
import {Avatar} from 'primeng/avatar';
import {Ripple} from 'primeng/ripple';
import {AuthenticationService} from '@shared/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'header-component',
  imports: [
    Button,
    Menu,
    Avatar,
    Ripple,
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
          <ng-template #item let-item>
            @if (item.delete) {
              <a pRipple class="flex items-center p-menu-item-link bg-red-100">
                <span [class]="item.icon" class="text-red-400"></span>
                <span class="ml-2 text-red-400">{{ item.label }}</span>
              </a>
            } @else {
              <a pRipple class="flex items-center p-menu-item-link">
                <span [class]="item.icon"></span>
                <span class="ml-2">{{ item.label }}</span>
              </a>
            }
          </ng-template>
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
  `,
  styles: `
    .p-menu-item-content {
      background-color: rgba(255, 0, 0, 0.25);

      a {
        color: red;
      }
    }
  `
})
export class HeaderComponent {

  protected readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  protected items: MenuItem[] = [
    {
      icon: 'pi pi-id-card',
      label: 'Account Details'
    },
    {
      icon: 'pi pi-eye',
      label: 'View Company'
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authenticationService.logout().then(value => {
          this.router.navigateByUrl("/login").then(); // TODO - add a confirm dialog for logout
        });
      },
      delete: true
    },
    {
      separator: true
    }
  ];

  public user = input.required<AdvancedUserBody>();
  protected userName = computed(() => this.user().forename + " " + this.user().surname);
  protected userType = computed(() => this.user().userType);

  protected toggleAccountMenu(menu: Menu, event: Event) {
    menu.toggle(event);
  }

}
