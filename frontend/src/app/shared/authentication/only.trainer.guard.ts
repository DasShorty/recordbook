import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

@Injectable({providedIn: 'root'})
export class OnlyTrainerGuard implements CanActivate {

  private readonly userStore = inject(UserStore);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authority = this.userStore.activeUser().authority;
    return authority === Authority.TRAINER || authority === Authority.ADMINISTRATOR;
  }

}
