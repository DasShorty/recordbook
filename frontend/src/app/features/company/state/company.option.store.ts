import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CompanyOption} from '@features/company/models/company.model';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';

export const CompanyOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    companies: [] as CompanyOption[],
    offset: 0,
    filter: '' as string
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      retrieveCompanies() {

        if (store.companies().length != 0) {
          return;
        }

        this.getCompanyOptions(0, store.filter()).then();
      },

      retrieveCompaniesLazy() {
        this.getCompanyOptions(store.offset() + 50, store.filter()).then();
      },

      filterOptions(filter: string) {

        if (filter == store.filter()) {
          patchState(store, {
            offset: store.offset() + 50,
            filter: filter
          });
        } else {
          patchState(store, {
            offset: 0,
            filter: filter
          });
        }


        this.getCompanyOptions(store.offset(), filter).then();
      },

      async getCompanyOptions(offset: number, name: string) {

        const httpParams = new HttpParams()
          .set("offset", offset)
          .set("limit", 50)
          .set("name", name);

        const res = await firstValueFrom(httpClient.get<QueryResult<CompanyOption[]>>(httpConfig.baseUrl + "companies/options", {
          params: httpParams,
          withCredentials: true,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return;
        }

        patchState(store, {
          companies: res.body.data,
          offset: res.body.offset
        });

      }

    }

  })
)
