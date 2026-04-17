import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {User} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpConfig} from '@environment/environment';
import {Page} from '@core/http/model/page.model';
import {Observable, tap} from 'rxjs';

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState({
    activeUser: {} as User,
    users: {} as Page<User>
  }),

  withMethods((store) => {

    const httpClient = inject(HttpClient)

    return {

      retrieveActiveUser(): Observable<User> {
        return httpClient.get<User>(httpConfig.baseUrl + 'authentication/me', {
          withCredentials: true
        }).pipe(tap(res => {
          patchState(store, {
            activeUser: res
          });
        }));
      },

      clearActiveUser() {
        patchState(store, {
          activeUser: {} as User
        });
      },


      getActiveUser() {
        return store.activeUser();
      },

    }

  })
);
