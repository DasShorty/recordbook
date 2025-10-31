import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Qualification} from '@features/job/models/qualification.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Optional} from '@shared/data/optional';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {QueryResult} from '@core/http/http.model';
import {Consumer} from '@shared/data/consumer';

export const QualificationStore = signalStore(
  {providedIn: 'root'},
  withState({
    qualifications: [] as Qualification[],
    limit: 10 as number,
    offset: 0 as number,
    total: 0 as number
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      retrieveQualifications(limit: number, offset: number, finished?: Consumer<boolean>) {

        this.getQualifications(limit, offset).then(optional => {

          finished?.(optional.isPresent());

          if (optional.isEmpty()) {
            return;
          }

          const queryResult = optional.get();

          patchState(store, {
            qualifications: queryResult.data,
            limit: queryResult.limit,
            offset: queryResult.offset,
            total: queryResult.total
          });

        });

      },

      async getQualifications(limit: number, offset: number): Promise<Optional<QueryResult<Qualification[]>>> {

        const res = await firstValueFrom(httpClient
          .get<QueryResult<Qualification[]>>(httpConfig.baseUrl + 'jobs/qualifications?limit=' + limit + "&offset=" + offset, {
            observe: 'response',
            withCredentials: true
          }));

        if (!res.ok || res.body == null) {
          return Optional.empty();
        }

        return Optional.of(res.body);
      },

      async createQualification({name, description, minimumDuration}: {
        name: string,
        description: string,
        minimumDuration: number
      }): Promise<Optional<Qualification>> {

        const res = await firstValueFrom(httpClient.post<Qualification>(httpConfig.baseUrl + "jobs/qualifications", {
          name: name,
          description: description,
          minimumDuration: minimumDuration
        }, {
          withCredentials: true,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return Optional.empty();
        }

        return Optional.of(res.body);
      },

      async updateQualification(qualification: Qualification): Promise<Optional<Qualification>> {

        const res = await firstValueFrom(httpClient.put<Qualification>(httpConfig.baseUrl + "jobs/qualifications", qualification, {
          withCredentials: true,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return Optional.empty();
        }

        return Optional.of(res.body);
      },

      replaceQualification(qualification: Qualification) {
        patchState(store, {
          qualifications: store.qualifications().map(value => value.id == qualification.id ? qualification : value)
        });
      },

      addQualification(qualification: Qualification) {
        patchState(store, {
          qualifications: [qualification, ...store.qualifications()]
        });
      },

      async deleteQualification(qualificationId: string): Promise<boolean> {

        const res = await firstValueFrom(httpClient.delete<void>(httpConfig.baseUrl + "jobs/qualifications/" + qualificationId, {
          withCredentials: true,
          observe: 'response'
        }));

        return res.ok;
      }

    }

  })
)
