import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {AdvancedUserBody} from '@shared/users/users.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {QueryResult} from '@shared/http/http.model';

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState({
    activeUser: {} as AdvancedUserBody
  }),

  withMethods((store) => {

    const httpClient = inject(HttpClient)

    return {

      async retrieveActiveUser() {

        const response = await firstValueFrom(httpClient.get<AdvancedUserBody>(httpConfig.baseUrl + 'authentication/me', {withCredentials: true, observe: 'response'}));




      },

      setActiveUser(user: AdvancedUserBody) {
        patchState(store, {
          activeUser: user
        });
      },

      getActiveUser() {
        return store.activeUser();
      },

      async getUsersByCompany(companyId: string, offset: number, limit: number) {
        const response = await firstValueFrom(httpClient.get<QueryResult<AdvancedUserBody[]>>(httpConfig.baseUrl + "users?companyId" + companyId + "&offset=" + offset + "&limit" + limit, {
          withCredentials: true,
          observe: "response"
        }));

        const body = response.body;

        if (body == null) {
          return;
        }

        return body;
      }

    }

  })
);
