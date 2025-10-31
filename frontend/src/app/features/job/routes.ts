import {Route} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@features/job/pages/job.page').then(m => m.JobPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'qualifications',
    loadComponent: () => import('@features/job/pages/qualifications.page').then(m => m.QualificationsPage),
    canActivate: [AuthGuard]
  }
]
