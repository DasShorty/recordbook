import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {UserBody, UserOption, UserType} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';
import {firstValueFrom} from 'rxjs';

export const UserOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    trainees: [] as UserOption[],
    traineeOffset: 0,
    trainers: [] as UserOption[],
    trainerOffset: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      mapUserToOption(user: UserBody): UserOption {
        return {
          id: user.id,
          name: user.forename + " " + user.surname
        } as UserOption;
      },

      retrieveTrainers() {

        if (store.trainers().length == 0) {
          this.loadOptions(UserType.TRAINER, false).then();
        }

      },

      retrieveTrainees() {

        if (store.trainees().length == 0) {
          this.loadOptions(UserType.TRAINEE, false).then();
        }

      },

      async loadOptions(userType: UserType, next: boolean = true) {

        const offset = userType == UserType.TRAINER ? store.trainerOffset() : store.traineeOffset();
        const params = new HttpParams()
          .set("userType", userType.toLowerCase())
          .set("limit", 50)
          .set("offset", String(offset + (next ? 50 : 0)))


        const res = await firstValueFrom(httpClient.get<QueryResult<UserBody[]>>(httpConfig.baseUrl + "users/options", {
          withCredentials: true,
          params: params,
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return false;
        }

        switch (userType) {

          case UserType.TRAINEE:
            patchState(store, {
              trainees: res.body.data.map(value => this.mapUserToOption(value)),
              traineeOffset: res.body.offset
            })
            break;

          case UserType.TRAINER:
            patchState(store, {
              trainers: res.body.data.map(value => this.mapUserToOption(value)),
              trainerOffset: res.body.offset
            })
            break;

          case UserType.COMPANY:
            // can be ignored
            break;

        }

        return true;
      }

    }

  })
)
