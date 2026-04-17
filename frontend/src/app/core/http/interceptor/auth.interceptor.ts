import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, take, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {AuthenticationService} from '@core/auth/authentication.service';
import {Router} from '@angular/router';
import {UserStore} from '@core/users/state/user.store';

export function validateAuthenticationInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const userStore = inject(UserStore);

  const handleLogoutAndFlow = (error: any) => {
    console.log("Handling logout due to error:", error);
    userStore.clearActiveUser();
    authenticationService.logout().then();
    router.navigateByUrl('/login').then();
    return throwError(() => error);
  }

  return next(req).pipe(
    catchError(error => {

      console.log("Auth Interceptor caught error:", error);
      if (!error || error.status !== 403) {
        return throwError(() => error);
      }

      return authenticationService.refreshToken().pipe(
        take(1),
        catchError(() => handleLogoutAndFlow(error)),
        switchMap(refreshRes => {

          console.log("Refresh token response in interceptor:", refreshRes);

          if (refreshRes?.ok) {
            return next(req);
          }

          return handleLogoutAndFlow(error);
        })
      )

    })
  );

}
