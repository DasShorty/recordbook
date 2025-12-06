import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

@Injectable({providedIn: 'root'})
export class OnlyTrainerGuard implements CanActivate {

  private readonly userStore = inject(UserStore);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return of(this.userStore.activeUser().authority == Authority.TRAINER || this.userStore.activeUser().authority == Authority.ADMINISTRATOR);
  }

}
