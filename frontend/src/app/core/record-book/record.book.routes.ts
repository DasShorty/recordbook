import {Routes} from '@angular/router';
import {AuthGuard} from '@shared/authentication/auth.guard';

export const routes: Routes = [

  {
    path: 'week',
    loadComponent: () => import('@core/record-book/week/record.book.week.page').then(m => m.RecordBookWeekPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('@core/record-book/record.book.page').then(m => m.RecordBookPage),
    pathMatch: "full",
    canActivate: [AuthGuard]
  }
]
