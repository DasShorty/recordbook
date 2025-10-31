import {Routes} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@core/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'record-book',
    loadChildren: () => import('@features/book/routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs',
    loadChildren: () => import('@features/job/routes').then(m => m.routes),
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
    loadComponent: () => import('@features/company/company.page').then(m => m.CompanyPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'trainers',
    loadComponent: () => import('@features/trainer/trainer.page').then(m => m.TrainerPage),
    canActivate: [AuthGuard]
  },

  {
    path: 'trainees',
    loadComponent: () => import('@features/trainee/trainee.page').then(m => m.TraineePage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
];
