import {Routes} from '@angular/router';
import {AuthGuard} from '@shared/authentication/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@core/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'record-book',
    loadComponent: () => import('@core/record-book/record.book.page').then(m => m.RecordBookPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@core/home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('@core/admin/admin.page').then(m => m.AdminPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
];
