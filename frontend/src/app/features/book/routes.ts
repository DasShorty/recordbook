import {Routes} from '@angular/router';
import {AuthGuard} from '@core/auth/auth.guard';
import {onlyTrainerGuard} from '@shared/authentication/only.trainer.guard';
import {bookManagerIdResolver} from '@features/book/resolver/book.manager.resolver';
import {bookCalendarResolver} from '@features/book/resolver/book.calendar.resolver';
import {yearRouteResolver} from '@shared/http/year.route.resolver';

export const routes: Routes = [

  {
    path: 'overview',
    loadComponent: () => import('@features/book/pages/book-year-overview.page').then(m => m.BookYearOverviewPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'week',
    loadComponent: () => import('@features/book/pages/record.book.week.page').then(m => m.RecordBookWeekPage),
    canActivate: [AuthGuard]
    // TODO => Refactor component to use the resolvers
  },
  {
    path: 'manage',
    loadComponent: () => import('@features/book/pages/book.manager.page').then(m => m.BookManagerPage),
    canActivate: [AuthGuard, onlyTrainerGuard]
  },
  {
    path: 'manage/view/:bookId',
    loadComponent: () => import('@features/book/pages/book.manager.view.page').then(m => m.BookManagerViewPage),
    canActivate: [AuthGuard, onlyTrainerGuard],
    resolve: {
      book: bookManagerIdResolver,
      calendarWeek: bookCalendarResolver,
      calendarYear: yearRouteResolver
    },
    runGuardsAndResolvers: 'pathParamsOrQueryParamsChange'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview'
  }
]
