import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private readonly httpClient = inject(HttpClient);

  public logout() {
    let httpHeaders = new HttpHeaders().set('Access-Control-Allow-Credentials', 'true')
      .set("Access-Control-Allow-Origin", "*");

    return firstValueFrom(this.httpClient.post(httpConfig.baseUrl + 'authentication/logout', {}, {
      withCredentials: true,
      observe: 'response',
      headers: httpHeaders
    }));
  }

  public async login(email: string, password: string) {

    const response = await firstValueFrom(this.httpClient.post<void>(httpConfig.baseUrl + 'authentication/login', {
      email: email,
      password: password
    }, {
      observe: 'response',
      withCredentials: true
    }));

    return response.ok;
  }

  public refreshToken() {
    return this.httpClient.get<void>(httpConfig.baseUrl + 'authentication/refresh', {
      withCredentials: true,
      observe: "response"
    });
  }

  public checkAuthenticationSubject() {

    let httpHeaders = new HttpHeaders().set('Access-Control-Allow-Credentials', 'true')
      .set("Content-Type", "text/plain")
      .set("Access-Control-Allow-Origin", "*");

    return this.httpClient.get<void>(httpConfig.baseUrl, {
      withCredentials: true,
      observe: 'response',
      headers: httpHeaders
    });
  }

}
