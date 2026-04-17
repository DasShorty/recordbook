import {inject} from '@angular/core';
import {CanMatchFn, Router} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';
import {catchError, map, of, take} from 'rxjs';

export function roleGuard(...requiredRoles: Authority[]): CanMatchFn {
  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);
    const activeUser = userStore.getActiveUser();

    const isAuthorized = (user: typeof activeUser): boolean => {
      return Boolean(user?.id) && requiredRoles.includes(user.authority);
    };

    if (isAuthorized(activeUser)) {
      return true;
    }

    return userStore.retrieveActiveUser().pipe(
      take(1),
      map(user => isAuthorized(user) ? true : router.parseUrl('/login')),
      catchError(() => of(router.parseUrl('/login')))
    );
  };
}

