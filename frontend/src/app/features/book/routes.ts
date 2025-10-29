import {Routes} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';

export const routes: Routes = [

  {
    path: 'week',
    loadComponent: () => import('@features/book/pages/record.book.week.page').then(m => m.RecordBookWeekPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('@features/book/pages/record.book.page').then(m => m.RecordBookPage),
    pathMatch: "full",
    canActivate: [AuthGuard]
  }
]
