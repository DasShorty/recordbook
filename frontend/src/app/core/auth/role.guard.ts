import {inject} from '@angular/core';
import {CanMatchFn, Router} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

export function roleGuard(...requiredRoles: Authority[]): CanMatchFn {
  return () => {
    const userStore = inject(UserStore);
    const router = inject(Router);
    const activeUser = userStore.getActiveUser();

    if (!activeUser || !activeUser.id) {
      router.navigate(['/login']).then();
      return false;
    }

    const hasRole = requiredRoles.includes(activeUser.authority);

    if (!hasRole) {
      router.navigate(['/']).then();
      return false;
    }

    return true;
  };
}

