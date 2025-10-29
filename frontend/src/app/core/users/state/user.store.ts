import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {AdvancedUser} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {QueryResult} from '@core/http/http.model';

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

      async getUsersByCompany(companyId: string, offset: number, limit: number) {

        patchState(store, {
          error: false,
          loading: true,
        })

        const response = await firstValueFrom(httpClient.get<QueryResult<AdvancedUser[]>>(httpConfig.baseUrl + "users?companyId" + companyId + "&offset=" + offset + "&limit" + limit, {
          withCredentials: true,
          observe: "response"
        }));

        if (!response.ok || response.body === null) {
          patchState(store, {
            loading: false,
            error: true
          });
          return;
        }

        patchState(store, {
          users: response.body.data,
          limit: response.body.limit,
          offset: response.body.offset,
          totalCount: response.body.total,
          loading: false,
          error: false
        });

      }

    }

  })
);
