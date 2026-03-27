import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CreateUser, User} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {retry} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {Page} from '@core/http/model/page.model';
import {Consumer} from '@shared/data/consumer';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export const AdminUserStore = signalStore(
  {providedIn: 'root'},
  withState({
    users: {} as Page<User>
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      fetchUsers(size: number, page: number) {
        return httpClient.get<Page<User>>(httpConfig.baseUrl + "users", {
          withCredentials: true,
          params: {
            page: page,
            size: size
          }
        });
      },

      getUsers(size: number = 20, page: number = 0) {

        this.fetchUsers(size, page).pipe(takeUntilDestroyed()).subscribe(page => {

          if (!page) {
            return;
          }

          patchState(store, {
            users: page,
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
