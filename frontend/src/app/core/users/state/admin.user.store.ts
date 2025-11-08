import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {AdvancedUser} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {QueryResult} from '@core/http/http.model';

export const AdminUserStore = signalStore(
  {providedIn: 'root'},
  withState({
    users: [] as AdvancedUser[],
    total: 0 as number,
    offset: 0 as number,
    limit: 10 as number,
    loading: false,
    error: false
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      async getUsers(limit: number, offset: number) {

        patchState(store, {
          loading: true,
          error: false
        });

        const response = await firstValueFrom(httpClient.get<QueryResult<AdvancedUser[]>>(httpConfig.baseUrl + "users?limit=" + limit + "&offset=" + offset, {
          withCredentials: true,
          observe: 'response'
        }));

        if (!response.ok || response.body === null) {
          patchState(store, {
            loading: false,
            error: true
          });
          return;
        }

        patchState(store, {
          loading: false,
          error: false,
          users: response.body.data as AdvancedUser[],
          limit: response.body.limit,
          offset: response.body.offset,
          total: response.body.total
        });

      },

      async createUser(forename: string, surname: string, email: string, userType: string, companyId: string | null | undefined) {

        patchState(store, {
          loading: true,
          error: false
        });

        const response = await firstValueFrom(httpClient.post<AdvancedUser>(httpConfig.baseUrl + "users", {
            forename: forename,
            surname: surname,
            email: email,
            userType: userType,
            companyId: companyId
          },
          {
            observe: 'response',
            withCredentials: true
          }));

        if (!response.ok || response.body === null) {
          patchState(store, {
            loading: false,
            error: true
          })
          return;
        }

        patchState(store, {
          loading: false,
          error: false,
          users: [response.body, ...store.users()],
          total: store.total() + 1
        });
      }

    }

  })
)
