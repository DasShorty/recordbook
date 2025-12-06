import {Routes} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';

export const routes: Routes = [

  {
    path: 'week',
    loadComponent: () => import('@features/book/pages/record.book.week.page').then(m => m.RecordBookWeekPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'manage',
    loadComponent: () => import('@features/book/pages/book.manager.page').then(m => m.BookManagerPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'week'
  }
]
