import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';
import {catchError, map, Observable, of, take} from 'rxjs';

@Injectable({providedIn: 'root'})
export class OnlyAdminGuard implements CanActivate {

  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const activeUser = this.userStore.getActiveUser();

    if (activeUser?.id && activeUser.authority === Authority.ADMINISTRATOR) {
      return of(true);
    }

    return this.userStore.retrieveActiveUser().pipe(
      take(1),
      map(user => user.authority === Authority.ADMINISTRATOR ? true : this.router.createUrlTree(['/dashboard'])),
      catchError(() => of(this.router.createUrlTree(['/dashboard'])))
    );
  }

}
