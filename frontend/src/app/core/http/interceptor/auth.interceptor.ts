import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, take, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {AuthenticationService} from '@core/auth/authentication.service';
import {Router} from '@angular/router';

export function validateAuthenticationInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {

      if (!error || error.status !== 403) {
        return throwError(() => error);
      }

      return authenticationService.refreshToken().pipe(
        take(1),
        switchMap(refreshRes => {

          if (refreshRes?.ok) {
            return next(req);
          }

          authenticationService.logout().then();
          router.navigateByUrl('/login').then();
          return throwError(() => error);

        }),
        catchError(() => {
          authenticationService.logout().then();
          router.navigateByUrl('/login').then();
          return throwError(() => error);
        })
      )

    })
  );

}
