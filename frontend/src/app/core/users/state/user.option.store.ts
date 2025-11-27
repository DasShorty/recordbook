import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {UserType} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QueryResult} from '@core/http/http.model';
import {httpConfig} from '@environment/environment';
import {firstValueFrom} from 'rxjs';
import {SelectOption} from '@shared/http/model/select.option.model';

export const UserOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    trainees: [] as SelectOption<String>[],
    traineeOffset: 0,
    trainers: [] as SelectOption<String>[],
    trainerOffset: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

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


        const res = await firstValueFrom(httpClient.get<QueryResult<SelectOption<String>[]>>(httpConfig.baseUrl + "users/options", {
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
              trainees: res.body.data,
              traineeOffset: res.body.offset
            })
            break;

          case UserType.TRAINER:
            patchState(store, {
              trainers: res.body.data,
              trainerOffset: res.body.offset
            })
            break;
        }

        return true;
      }

    }

  })
)
