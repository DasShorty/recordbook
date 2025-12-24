import {ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {of} from 'rxjs';
import {WeekService} from '@features/book/services/week.service';

export const bookCalendarResolver: ResolveFn<number> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const weekService = inject(WeekService);
  const yearParam = route.queryParamMap.get('cw');

  if (yearParam && !Number.isNaN(Number(yearParam))) {
    return of(Number(yearParam));
  }

  const defaultCw = weekService.getCurrentWeekNumber();
  const urlTree = router.parseUrl(state.url);

  urlTree.queryParams = {
    ...urlTree.queryParams,
    cw: defaultCw
  }

  return new RedirectCommand(urlTree);
}
