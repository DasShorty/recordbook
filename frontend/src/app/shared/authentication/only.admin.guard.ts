import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

@Injectable({providedIn: 'root'})
export class OnlyAdminGuard implements CanActivate {

  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const isAdmin = this.userStore.activeUser().authority === Authority.ADMINISTRATOR;
    if (!isAdmin) {
      return of(this.router.createUrlTree(['/dashboard']));
    }
    return of(true);
  }

}
