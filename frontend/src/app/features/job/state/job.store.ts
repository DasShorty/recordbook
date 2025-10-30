import {signalStore, withMethods, withState} from '@ngrx/signals';
import {Job} from '@features/job/models/job.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

    }

  })
)
