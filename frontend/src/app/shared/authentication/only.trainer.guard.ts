import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';
import {Authority} from '@core/users/models/users.model';

export const onlyTrainerGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  return userStore.activeUser().authority === Authority.TRAINER ||
         userStore.activeUser().authority === Authority.ADMINISTRATOR;
};
