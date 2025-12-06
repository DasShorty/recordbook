import {computed, inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticationService} from '@core/auth/authentication.service';
import {catchError, map, Observable, of, take} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly LOGIN_ROUTE = computed(() => this.router.parseUrl("/login"));

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authenticationService.checkAuthenticationSubject().pipe(
      take(1),
      map(value => value.ok ? true : this.LOGIN_ROUTE()),
      catchError(() => this.authenticationService.refreshToken().pipe(
        take(1),
        map(value => value.ok ? true : this.LOGIN_ROUTE()),
        catchError(() => of(this.LOGIN_ROUTE()))
      ))
    );
  }
}
