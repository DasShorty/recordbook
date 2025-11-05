import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {UserBody, UserType} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';
import {tap} from 'rxjs';

export const UserOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    trainees: [] as UserBody[],
    traineeOffset: 0,
    trainers: [] as UserBody[],
    trainerOffset: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      loadOptions(userType: UserType, next: boolean = true) {

        const offset = userType == UserType.TRAINER ? store.trainerOffset() : store.traineeOffset();
        const params = new HttpParams()
          .set("userType", userType.toLowerCase())
          .set("offset", String(offset + (next ? 50 : 0)))
          .set("limit", "50");

        httpClient.get<QueryResult<UserBody[]>>(httpConfig.baseUrl + "users", {
          withCredentials: true,
          params: params
        })
          .pipe(
            tap(items => patchState(store, {
              trainees: userType == UserType.TRAINEE ? items.data : store.trainees(),
              traineeOffset: userType == UserType.TRAINEE ? items.offset : store.traineeOffset(),
              trainers: userType == UserType.TRAINER ? items.data : store.trainers(),
              trainerOffset: userType == UserType.TRAINER ? items.offset : store.trainerOffset()
            }))
          )

      }

    }

  })
)
