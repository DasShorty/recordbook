import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {User} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpConfig} from '@environment/environment';
import {Page} from '@core/http/model/page.model';

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState({
    activeUser: {} as User,
    users: {} as Page<User>
  }),

  withMethods((store) => {

    const httpClient = inject(HttpClient)

    return {

      retrieveActiveUser() {

        httpClient.get<User>(httpConfig.baseUrl + 'authentication/me', {
          withCredentials: true
        }).subscribe(res => {
          patchState(store, {
            activeUser: res
          });
        })
      },


      getActiveUser() {
        return store.activeUser();
      },

    }

  })
);
