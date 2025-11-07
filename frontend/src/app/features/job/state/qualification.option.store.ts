import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {QualificationOption} from '@features/job/models/qualification.model';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';

export const QualificationOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    qualifications: [] as QualificationOption[],
    limit: 50,
    offset: 0,
    filter: "" as string
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      async filterQualifications(filter: string) {

        const httpParams = new HttpParams()
          .set('offset', 0)
          .set('limit', store.limit())
          .set("filter", filter);

        const res = await firstValueFrom(httpClient.get<QueryResult<QualificationOption[]>>(httpConfig.baseUrl + "jobs/qualifications/options", {
          withCredentials: true,
          params: httpParams,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return;
        }

        patchState(store, {
          qualifications: res.body.data,
          limit: res.body.limit,
          offset: res.body.offset,
          filter: filter
        });

      },

      async loadMoreQualifications() {

        const offset = store.qualifications().length >= store.limit() ? store.offset() + store.limit() : store.offset()

        let httpParams = new HttpParams()
          .set('offset', offset)
          .set('limit', store.limit());

        if (store.filter().trim() !== '') {
          httpParams = httpParams.append("filter", store.filter().trim());
        }

        const res = await firstValueFrom(httpClient
          .get<QueryResult<QualificationOption[]>>(httpConfig.baseUrl + "jobs/qualifications/options", {
            withCredentials: true,
            observe: 'response',
            params: httpParams
          }));

        if (!res.ok || res.body == null) {
          return;
        }

        patchState(store, {
          qualifications: [...store.qualifications(), ...res.body.data],
          limit: res.body.limit,
          offset: res.body.offset
        });

      }

    }

  })
)
