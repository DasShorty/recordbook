import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {AdvancedUser} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState({
    activeUser: {} as AdvancedUser,
    users: [] as AdvancedUser[],
    limit: 10,
    offset: 0,
    totalCount: 0,
    loading: false,
    error: false
  }),

  withMethods((store) => {

    const httpClient = inject(HttpClient)

    return {

      async retrieveActiveUser() {

        const response = await firstValueFrom(httpClient.get<AdvancedUser>(httpConfig.baseUrl + 'authentication/me', {
          withCredentials: true,
          observe: 'response'
        }));

        if (!response.ok) {
          return null;
        }

        return response.body;
      },

      setActiveUser(user: AdvancedUser) {
        patchState(store, {
          activeUser: user
        });
      },

      getActiveUser() {
        return store.activeUser();
      },

    }

  })
);
