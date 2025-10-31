import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Qualification} from '@features/job/models/qualification.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';

export const QualificationSearchStore = signalStore(
  {providedIn: 'root'},
  withState({
    qualifications: [] as Qualification[],
    limit: 10,
    offset: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      async loadMoreQualifications() {

                const offset = store.qualifications().length >= store.limit() ? store.offset() + store.limit() : store.offset()

        const res = await firstValueFrom(httpClient
          .get<QueryResult<Qualification[]>>(httpConfig.baseUrl + "jobs/qualifications", {
            withCredentials: true,
            observe: 'response',
            params: {
              limit: store.limit(),
              offset: offset
            }
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
