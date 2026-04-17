import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {catchError, map, Observable, of, take} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly LOGIN_ROUTE = this.router.parseUrl('/login');

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const activeUser = this.userStore.getActiveUser();

    if (activeUser?.id) {
      return of(true);
    }

    return this.userStore.retrieveActiveUser().pipe(
      take(1),
      map(() => true),
      catchError(() => of(this.LOGIN_ROUTE))
    );
  }
}
