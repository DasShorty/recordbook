import {Component, ChangeDetectionStrategy, inject, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';
import {AuthenticationService} from '@core/auth/authentication.service';

interface NavLink {
  label: string;
  path: string;
  roles: Authority[];
  icon: string;
}

@Component({
  selector: 'sidebar-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="drawer.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="toolbar-title">Recordbook</span>
    </mat-toolbar>

    <mat-drawer-container hasBackdrop="false">
      <mat-drawer #drawer mode="side">
        <mat-nav-list>
          <mat-list-item routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Home</span>
          </mat-list-item>

          @for (link of visibleLinks(); track link.path) {
            <mat-list-item
              [routerLink]="link.path"
              routerLinkActive="active"
              (click)="drawer.close()">
              <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
              <span matListItemTitle>{{ link.label }}</span>
            </mat-list-item>
          }

          <mat-divider></mat-divider>

          <mat-list-item (click)="logout()">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Logout</span>
          </mat-list-item>
        </mat-nav-list>
      </mat-drawer>

      <mat-drawer-content>
        <router-outlet/>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    mat-drawer-container {
      flex: 1;
      min-height: 0;
    }

    .toolbar-title {
      margin-left: 16px;
    }

    mat-nav-list {
      padding-top: 0;
    }

    mat-list-item.active {
      color: var(--mdc-theme-primary, #3f51b5);
      background-color: rgba(63, 81, 181, 0.08);
    }

    mat-divider {
      margin: 8px 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SidebarNavComponent {
  private readonly userStore = inject(UserStore);
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);

  private navLinks: NavLink[] = [
    {
      label: 'User Administration',
      path: '/users',
      roles: [Authority.ADMINISTRATOR],
      icon: 'people',
    },
    {
      label: 'Recordbook Management',
      path: '/recordbooks',
      roles: [Authority.ADMINISTRATOR, Authority.TRAINER],
      icon: 'book',
    },
    {
      label: 'Week Fillout',
      path: '/weeks/fillout',
      roles: [Authority.TRAINEE],
      icon: 'edit_note',
    },
    {
      label: 'Week Approval',
      path: '/weeks/approval',
      roles: [Authority.TRAINER],
      icon: 'assignment_turned_in',
    },
    {
      label: 'Week Overview',
      path: '/weeks/overview',
      roles: [Authority.TRAINEE, Authority.TRAINER],
      icon: 'calendar_month',
    },
  ];

  visibleLinks = computed(() => {
    const activeUser = this.userStore.getActiveUser();
    if (!activeUser || !activeUser.authority) {
      return [];
    }
    return this.navLinks.filter(link => link.roles.includes(activeUser.authority));
  });

  async logout() {
    this.userStore.clearActiveUser();
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}


