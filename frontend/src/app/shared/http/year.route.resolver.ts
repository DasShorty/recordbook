import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {of} from 'rxjs';

export const yearRouteResolver: ResolveFn<number> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const yearParam = route.queryParamMap.get('year');

  if (yearParam && !Number.isNaN(Number(yearParam))) {
    return of(Number(yearParam));
  }

  return of(new Date().getFullYear());
}
