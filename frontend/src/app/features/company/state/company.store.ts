import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Company, CompanyNameCheckResult} from '@features/company/models/company.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@core/http/http.model';
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

      async createCompany(companyName: string): Promise<number> {

        const response = await firstValueFrom(httpClient.post<Company>(httpConfig.baseUrl + "companies", {
          companyName: companyName,
          users: []
        }, {
          withCredentials: true,
          observe: 'response'
        }));

        if (!response.ok || response.body === null) {
          return response.status;
        }

        patchState(store, {
          companies: [...store.companies(), response.body]
        });

        return response.status;
      },

      checkCompanyName(companyName: string) {
        return httpClient.get<CompanyNameCheckResult>(httpConfig.baseUrl + "companies/name/" + companyName + "/exists", {
          withCredentials: true,
          observe: "response"
        });
      },

      async deleteCompany(companyId: string) {
        const response = await firstValueFrom(httpClient.delete(httpConfig.baseUrl + "companies/" + companyId, {
          withCredentials: true,
          observe: "response"
        }));

        return response.ok;
      },

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
