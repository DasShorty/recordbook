import {Routes} from '@angular/router';
import {loginGuard} from '@shared/authentication/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@core/login/login.page').then(m => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () => import('@core/home/home.page').then(m => m.HomePage),
    canActivate: [loginGuard]
  }
];
