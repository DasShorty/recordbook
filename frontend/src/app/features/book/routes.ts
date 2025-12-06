import {Routes} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';
import {OnlyTraineeGuard} from '@shared/authentication/only.trainee.guard';
import {onlyTrainerGuard} from '@shared/authentication/only.trainer.guard';

export const routes: Routes = [

  {
    path: 'week',
    loadComponent: () => import('@features/book/pages/record.book.week.page').then(m => m.RecordBookWeekPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'manage',
    loadComponent: () => import('@features/book/pages/book.manager.page').then(m => m.BookManagerPage),
    canActivate: [AuthGuard, onlyTrainerGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'week'
  }
]
