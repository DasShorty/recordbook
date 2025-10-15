import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {UserStore} from '@shared/users/user.store';
import {AdvancedUserBody} from '@shared/users/users.model';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private readonly httpClient = inject(HttpClient);
  private readonly userStore = inject(UserStore);

  public logout() {
    let httpHeaders = new HttpHeaders().set('Access-Control-Allow-Credentials', 'true')
      .set("Access-Control-Allow-Origin", "*");

    return firstValueFrom(this.httpClient.post(httpConfig.baseUrl + 'authentication/logout', {}, {
      withCredentials: true,
      observe: 'response',
      headers: httpHeaders
    }))
  }

  public async login(email: string, password: string) {
    try {
      await this.logout();
    } catch (error) {
      console.error('Logout failed before login:', error);
    }
    let httpHeaders = new HttpHeaders().set('Access-Control-Allow-Credentials', 'true')
      .set("Access-Control-Allow-Origin", "*");

    const response = await firstValueFrom(this.httpClient.post<AdvancedUserBody>(httpConfig.baseUrl + 'authentication/login', {
      email: email,
      password: password
    }, {
      headers: httpHeaders,
      observe: 'response',
      withCredentials: true
    }));

    const body = response.body;

    if (body == null) {
      return false;
    }

    this.userStore.setActiveUser(body);

    return response.ok;
  }

  public async refreshToken() {
    const response = await firstValueFrom(this.httpClient.get<AdvancedUserBody>(httpConfig.baseUrl + 'authentication/refresh', {withCredentials: true, observe: "response"}));

    const body = response.body;

    if (body === null) {
      return false;
    }

    this.userStore.setActiveUser(body);

    return response.ok;
  }

  public async checkAuthentication() {

    let httpHeaders = new HttpHeaders().set('Access-Control-Allow-Credentials', 'true')
      .set("Content-Type", "text/plain")
      .set("Access-Control-Allow-Origin", "*");

    try {
      const response = await firstValueFrom(this.httpClient.get<void>(httpConfig.baseUrl, {
        withCredentials: true,
        observe: 'response',
        headers: httpHeaders
      }));
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}
