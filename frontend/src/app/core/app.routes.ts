import {Routes} from '@angular/router';
import {AuthGuard} from '@shared/authentication/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@core/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'record-book',
    loadChildren: () => import('@core/record-book/record.book.routes').then(m => m.routes),
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
    path: 'company',
    loadComponent: () => import('@core/company/company.page').then(m => m.CompanyPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'trainers',
    loadComponent: () => import('@core/trainer/trainer.page').then(m => m.TrainerPage),
    canActivate: [AuthGuard]
  },

  {
    path: 'trainees',
    loadComponent: () => import('@core/trainee/trainee.page').then(m => m.TraineePage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
];
