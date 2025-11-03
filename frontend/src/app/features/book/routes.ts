import {Routes} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';

export const routes: Routes = [

  {
    path: 'week',
    loadComponent: () => import('@features/book/pages/record.book.week.page').then(m => m.RecordBookWeekPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'year',
    loadComponent: () => import('@features/book/pages/record.book.page').then(m => m.RecordBookPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'manage',
    loadComponent: () => import('@features/book/pages/trainer.book.manager.page').then(m => m.TrainerBookManagerPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'week'
  }
]
