import {ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {of} from 'rxjs';

export const yearRouteResolver: ResolveFn<number> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const yearParam = route.queryParamMap.get('year');

  if (yearParam && !Number.isNaN(Number(yearParam))) {
    return of(Number(yearParam));
  }

  const defaultYear = new Date().getFullYear();
  const urlTree = router.parseUrl(state.url);

  urlTree.queryParams = {
    ...urlTree.queryParams,
    year: defaultYear
  };

  return new RedirectCommand(urlTree);
}
