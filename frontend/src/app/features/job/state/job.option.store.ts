import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';
import {SelectOption} from '@shared/http/model/select.option.model';

export const JobOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    jobs: [] as SelectOption<String>[],
    offset: 0,
    filter: '' as string
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      retrieveJobs() {

        if (store.jobs().length != 0) {
          return;
        }

        this.getJobOptions(0, store.filter()).then();
      },

      retrieveJobsLazy() {
        this.getJobOptions(store.offset() + 50, store.filter()).then();
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


        this.getJobOptions(store.offset(), filter).then();
      },

      async getJobOptions(offset: number, name: string) {

        const httpParams = new HttpParams()
          .set("offset", offset)
          .set("limit", 50)
          .set("name", name);

        const res = await firstValueFrom(httpClient.get<QueryResult<SelectOption<String>[]>>(httpConfig.baseUrl + "jobs/options", {
          params: httpParams,
          withCredentials: true,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return;
        }

        patchState(store, {
          jobs: res.body.data,
          offset: res.body.offset
        });

      }

    }

  })
)
