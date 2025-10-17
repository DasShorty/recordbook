import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Company} from '@shared/company/company.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@shared/http/http.model';
import {httpConfig} from '@environment/environment';

export const CompanyStore = signalStore(
  {providedIn: 'root'},
  withState({
    companies: [] as Company[],
    limit: 10 as number,
    offset: 0 as number,
    loading: false as boolean,
    error: false as boolean
  }),
  withMethods((store) => {

    const httpClient = inject(HttpClient);

    return {

      async retrieveCompanies(offset: number, limit: number) {

        patchState(store, {
          loading: true,
          error: false
        });

        const response = await firstValueFrom(httpClient.get<QueryResult<Company[]>>(httpConfig.baseUrl + "companies?limit=" + limit + "&offset=" + offset, {
          withCredentials: true,
          observe: "response"
        }));

        let body = response.body;

        if (!response.ok || body === null) {

          patchState(store, {
            loading: false,
            error: true
          });

          return;
        }

        patchState(store, {
          companies: body.data,
          limit: body.limit,
          offset: body.offset,
          loading: false,
          error: false
        });
      },

      resetState() {
        patchState(store, {
          companies: [],
          loading: false,
          error: false
        });
      }

    }

  })
)
