import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '@shared/authentication/authentication.service';

export const loginGuard: CanActivateFn = async (route, state) => {

  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const response = await authenticationService.checkAuthentication();

  if (!response) {
    router.navigate(["/login"]).then();
    return false;
  }

  return true;
};
