import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  public retrieveAccessToken() {
    return localStorage.getItem('access_token');
  }

}
