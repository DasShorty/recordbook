import {Component, computed, effect, inject, signal} from '@angular/core';
import {UserStore} from '@core/users/state/user.store';
import {AuthenticationService} from '@core/auth/authentication.service';
import {Router} from '@angular/router';
import {Authority} from '@core/users/models/users.model';
import {CommonModule} from '@angular/common';
import {HlmButton} from '@spartan-ng/helm/button';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucideLogOut, lucideUser} from '@ng-icons/lucide';

@Component({
  selector: 'profile-component',
  imports: [CommonModule, HlmButton, NgIcon],
  providers: [provideIcons({lucideUser, lucideLogOut})],
  template: `
    <div class="relative">
      <button
        hlmBtn
        variant="ghost"
        size="icon"
        (click)="toggleMenu()"
        class="mr-4"
        type="button"
      >
        <ng-icon name="lucideUser" class="w-5 h-5"/>
      </button>

      @if (menuOpen()) {
        <div
          class="absolute right-0 top-12 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
          (click)="menuOpen.set(false)"
        >
          <!-- User Info Header -->
          <div class="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-default">
            <div class="flex gap-3 items-center">
              <ng-icon name="lucideUser" class="w-8 h-8 text-gray-600"/>
              <div class="flex flex-col">
                <span class="font-semibold text-sm">{{ userName() }}</span>
                <span class="text-xs text-gray-600">{{ userType() }}</span>
              </div>
            </div>
          </div>

          <!-- Logout Option -->
          <button
            class="w-full px-4 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600 transition text-left text-sm"
            (click)="logout()"
            type="button"
          >
            <ng-icon name="lucideLogOut" class="w-4 h-4"/>
            <span>Logout</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ProfileComponent {

  protected readonly menuOpen = signal(false);
  protected readonly authenticationService = inject(AuthenticationService);
  protected readonly userName = computed(() => this.user().forename + " " + this.user().surname);
  protected readonly userType = computed(() => {
    if (this.user().authority == Authority.ADMINISTRATOR) {
      return "ADMINISTRATOR"
    } else {
      return this.user().userType;
    }
  });
  private readonly userStore = inject(UserStore);
  public readonly user = computed(() => this.userStore.getActiveUser());
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      this.userStore.retrieveActiveUser()
    });
  }

  protected toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  protected logout() {
    this.menuOpen.set(false);
    this.authenticationService.logout().then(() => {
      this.router.navigateByUrl("/login").then(() => {
        window.location.href = window.location.toString()
      });
    });
  }
}

