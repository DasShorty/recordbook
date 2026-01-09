import {Component, computed, effect, inject, viewChild} from '@angular/core';
import {Menu} from 'primeng/menu';
import {Ripple} from 'primeng/ripple';
import {MenuItem} from 'primeng/api';
import {UserStore} from '@core/users/state/user.store';
import {AuthenticationService} from '@core/auth/authentication.service';
import {Router} from '@angular/router';
import {Authority} from '@core/users/models/users.model';

@Component({
  selector: 'profile-component', imports: [Menu, Ripple], template: `
    <button class="cursor-pointer bg-white m-5" (click)="toggleAccountMenu(menu, $event)">
      <i class="pi pi-user" style="font-size: 1.3rem;"></i>
    </button>
    <p-menu #menu appendTo="body" [model]="this.items" [popup]="true">
      <ng-template #start>
        <button pRipple
                class="relative w-full flex gap-4 justify-center items-center-safe hover:bg-gray-50 dark:hover:bg-gray-900"
                style="padding: 0.25rem">
          <i class="pi pi-user"></i>
          <span class="inline-flex flex-col items-start">
                    <span class="font-bold">{{ this.userName() }}</span>
                    <span class="text-sm">{{ this.userType() }}</span>
          </span>
        </button>
      </ng-template>
      <ng-template #item let-item>
        @if (item.delete) {
          <a pRipple style="padding: 0.25rem"
             class="flex items-center gap-2 cursor-pointer text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
            <span [class]="item.icon"></span>
            <span>{{ item.label }}</span>
          </a>
        } @else {
          <a pRipple style="padding: 0.25rem" class="flex items-center gap-2 cursor-pointer">
            <span [class]="item.icon"></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </ng-template>
    </p-menu>
  `, styles: `
    .p-menu-item-content {
      background-color: rgba(255, 0, 0, 0.25);

      a {
        color: red;
      }
    }
  `
})
export class ProfileComponent {

  protected readonly menu = viewChild<Menu>('menu');
  protected readonly authenticationService = inject(AuthenticationService);
  protected userName = computed(() => this.user().forename + " " + this.user().surname);
  protected userType = computed(() => {

    if (this.user().authority == Authority.ADMINISTRATOR) {
      return "ADMINISTRATOR"
    } else {
      return this.user().userType;
    }

  });
  private readonly userStore = inject(UserStore);
  public user = computed(() => this.userStore.getActiveUser());
  private readonly router = inject(Router);
  protected items: MenuItem[] = [{
    separator: true
  }, {
    label: 'Logout', icon: 'pi pi-sign-out', command: () => {
      this.menu()!!.hide();
      this.authenticationService.logout().then(() => {
        this.router.navigateByUrl("/login").then(value => {
          window.location.href = window.location.toString()
        }); // TODO - add a confirm dialog for logout
      });
    }, delete: true
  }];

  constructor() {
    effect(() => {
      this.userStore.retrieveActiveUser()
    });
  }

  protected toggleAccountMenu(menu: Menu, event: Event) {
    menu.toggle(event);
  }

}
