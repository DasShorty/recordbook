import {Routes} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';
import {roleGuard} from '@core/auth/role.guard';
import {Authority} from '@core/users/models/users.model';
import {onlyTrainerGuard} from '@shared/authentication/only.trainer.guard';
import LayoutPage from '@core/layout/layout.page';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@core/users/page/login.page').then(m => m.default),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutPage,
    children: [
      {
        path: '',
        loadComponent: () => import('@features/home/home.page').then(m => m.default),
      },
      {
        path: 'users',
        canMatch: [roleGuard(Authority.ADMINISTRATOR)],
        loadComponent: () => import('@features/admin/users/users.page').then(m => m.default),
      },
      {
        path: 'recordbooks',
        canMatch: [onlyTrainerGuard],
        loadComponent: () => import('@features/book/recordbook-management/recordbook-management.page').then(m => m.default),
      },
      {
        path: 'weeks/fillout',
        canMatch: [roleGuard(Authority.TRAINEE)],
        loadComponent: () => import('@features/book/week-fillout/week-fillout.page').then(m => m.default),
      },
      {
        path: 'weeks/approval',
        canMatch: [onlyTrainerGuard],
        loadComponent: () => import('@features/book/week-approval/week-approval.page').then(m => m.default),
      },
      {
        path: 'weeks/overview',
        canMatch: [roleGuard(Authority.TRAINEE, Authority.TRAINER)],
        loadComponent: () => import('@features/book/week-overview/week-overview.page').then(m => m.default),
      },
    ],
  },
];
