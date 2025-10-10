import {inject, Injectable, resource} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private readonly httpClient = inject(HttpClient);

  public login(email: string, password: string) {

    let httpHeaders = new HttpHeaders().set('Access-Control-Allow-Credentials', 'true')
      .set("Access-Control-Allow-Origin", "*");

    return firstValueFrom(this.httpClient.post<void>(httpConfig.baseUrl + 'authentication/login', {
      email: email,
      password: password
    }, {
      headers: httpHeaders,
      observe: 'response',
      withCredentials: true
    }));
  }

  public refreshToken() {
    return firstValueFrom(this.httpClient.get<void>(httpConfig.baseUrl + 'authentication/refresh', {withCredentials: true}));
  }

}
