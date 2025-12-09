import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CreateUser, User} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {retry} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {Page} from '@core/http/model/page.model';
import {Consumer} from '@shared/data/consumer';

export const AdminUserStore = signalStore(
  {providedIn: 'root'},
  withState({
    data: {} as Page<User>
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      getUsers(size: number = 20, page: number = 0) {

        const httpParams = new HttpParams()
          .set("page", page)
          .set("size", size);

        httpClient.get<Page<User>>(httpConfig.baseUrl + "users", {
          withCredentials: true,
          params: httpParams
        }).pipe(
          retry(1)
        ).subscribe(value => {

          patchState(store, {
            data: value
          });

        });

      },

      createUser(user: CreateUser, response: Consumer<User>) {
        httpClient.post<User>(httpConfig.baseUrl + "users", user, {
          withCredentials: true
        }).pipe(retry(1))
          .subscribe(res => {
            response(res);
          })
      }

    }

  })
)
