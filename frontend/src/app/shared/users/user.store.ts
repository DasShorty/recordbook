import {signalStore, type, withMethods, withState} from '@ngrx/signals';
import {eventGroup, on, withReducer} from '@ngrx/signals/events';
import {AdvancedUserBody} from '@shared/users/users.model';
import {UserService} from './user.service';
import {inject} from '@angular/core';
import {QueryResult} from '@shared/http/http.model';

export const userApiEvents = eventGroup({
  source: 'User API',
  events: {
    loadedSuccess: type<QueryResult<AdvancedUserBody[]>>(),
    loadedFailure: type<string>(),
    userCreated: type<AdvancedUserBody>(),
    userDeleted: type<string>(),
    userLoaded: type<AdvancedUserBody>(),
  }
});

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState({
    users: [] as AdvancedUserBody[],
    isLoading: false as boolean,
    error: null as string | null,
    selectedUser: null as AdvancedUserBody | null,
    total: 0 as number,
    offset: 0 as number,
    limit: 0 as number
  }),
  withReducer(
    on(userApiEvents.loadedSuccess, ({payload: users}) => ({
      users: users.data,
      isLoading: false,
      error: null,
      total: users.total ?? users.data.length,
      offset: users.offset ?? 0,
      limit: users.limit ?? users.data.length
    })),
    on(userApiEvents.loadedFailure, ({payload: error}) => ({isLoading: false, error})),
    on(userApiEvents.userCreated, ({payload: user}) => (state) => ({
      users: [user, ...state.users],
      isLoading: false,
      error: null
    })),
    on(userApiEvents.userDeleted, ({payload: id}) => (state) => ({
      users: state.users.filter(u => u.id !== id),
      isLoading: false,
      error: null
    })),
    on(userApiEvents.userLoaded, ({payload: user}) => ({
      selectedUser: user,
      isLoading: false,
      error: null
    }))
  ),

  withMethods((store) => {

    const userService = inject(UserService);

    return {

      loadUsers(offset: number, limit: number, companyId?: string) {

        let resource = userService.getUsers(offset, limit, companyId);

      }

    }

  })
);
