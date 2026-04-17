import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';
import {catchError, map, of, take} from 'rxjs';

export function onlyTrainerGuard() {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const activeUser = userStore.getActiveUser();

  if (activeUser?.id && (activeUser.authority === Authority.TRAINER || activeUser.authority === Authority.ADMINISTRATOR)) {
    return true;
  }

  return userStore.retrieveActiveUser().pipe(
    take(1),
    map(user => user.authority === Authority.TRAINER || user.authority === Authority.ADMINISTRATOR ? true : router.parseUrl('/login')),
    catchError(() => of(router.parseUrl('/login')))
  );
}
