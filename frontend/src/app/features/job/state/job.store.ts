import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Job, UpdateJob} from '@features/job/models/job.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';
import {Optional} from '@shared/data/optional';
import {Consumer} from '@shared/data/consumer';

export const JobStore = signalStore(
  {providedIn: 'root'},
  withState({
    jobs: [] as Job[],
    limit: 10,
    offset: 0,
    total: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      retrieveJobs(limit: number, offset: number, finished?: Consumer<boolean>) {

        this.getJobs(limit, offset).then(optional => {

          finished?.(optional.isPresent());

          if (optional.isEmpty()) {
            return;
          }

          const queryResult = optional.get();

          patchState(store, {
            jobs: queryResult.data,
            limit: queryResult.limit,
            offset: queryResult.offset,
            total: queryResult.total
          });

        });

      },

      async getJobs(limit: number, offset: number): Promise<Optional<QueryResult<Job[]>>> {

        const res = await firstValueFrom(httpClient
          .get<QueryResult<Job[]>>(httpConfig.baseUrl + "jobs?limit=" + limit + "&offset=" + offset, {
            withCredentials: true, observe: 'response'
          }));

        if (!res.ok || res.body == null) {
          return Optional.empty();
        }

        return Optional.of(res.body);
      },

      async createJob({name, description, qualifications}: {
        name: string,
        description: string,
        qualifications: string[]
      }): Promise<Optional<Job>> {

        const res = await firstValueFrom(httpClient.post<Job>(httpConfig.baseUrl + "jobs", {
          name: name,
          description: description,
          qualifications: qualifications
        }, {
          withCredentials: true,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return Optional.empty();
        }

        return Optional.of(res.body);
      },

      async deleteJob(jobId: string): Promise<boolean> {

        const res = await firstValueFrom(httpClient.delete<void>(httpConfig.baseUrl + "jobs", {
          withCredentials: true,
          observe: 'response'
        }));

        return res.ok;
      },

      replaceJob(job: Job) {
        patchState(store, {
          jobs: store.jobs().map(value => value.id == job.id ? job : value)
        });
      },

      async updateJob(job: UpdateJob): Promise<Optional<Job>> {

        const res = await firstValueFrom(httpClient.put<Job>(httpConfig.baseUrl + "jobs", job, {
          withCredentials: true,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return Optional.empty();
        }

        return Optional.of(res.body);

      }

    }

  }))
