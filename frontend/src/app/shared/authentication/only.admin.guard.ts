import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

@Injectable({providedIn: 'root'})
export class OnlyAdminGuard implements CanActivate {

  private readonly userStore = inject(UserStore);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.userStore.activeUser().authority === Authority.ADMINISTRATOR;
  }

}
