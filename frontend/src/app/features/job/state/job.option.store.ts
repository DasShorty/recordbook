import {signalStore, withState} from '@ngrx/signals';
import {JobOption} from '@features/job/models/job.model';

export const JobOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    jobs: [] as JobOption[],
    offset: 0
  })
)
