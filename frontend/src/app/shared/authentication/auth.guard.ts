import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticationService} from '@shared/authentication/authentication.service';
import {catchError, map, Observable, of, take} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authenticationService.checkAuthenticationSubject().pipe(
      take(1),
      map(value => value.ok ? true : this.router.parseUrl("/login")),
      catchError(() => of(this.router.parseUrl("/login")))
    );

  }
}

