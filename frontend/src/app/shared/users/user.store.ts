import {signalStore, type, withState} from '@ngrx/signals';
import {eventGroup, on, withReducer} from '@ngrx/signals/events';
import {UserBody} from '@shared/users/users.model';

export const userApiEvents = eventGroup({
  source: 'User API',
  events: {
    loadedSuccess: type<UserBody[]>(),
    loadedFailure: type<string>(),
  }
});

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState({
    users: [] as UserBody[],
    isLoading: false as boolean
  }),
  withReducer(
    on(userApiEvents.loadedSuccess, ({payload: users}) => ({users, isLoading: false}))
  )
);

