import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {User, UserType} from '@core/users/models/users.model';
import {inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpConfig} from '@environment/environment';
import {SelectOption} from '@shared/http/model/select.option.model';
import {Page} from '@shared/http/model/page.model';

export const UserOptionStore = signalStore(
  {providedIn: 'root'},
  withState({
    traineePage: {} as Page<SelectOption<String>>,
    trainersPage: {} as Page<SelectOption<String>>,
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      getPage(type: UserType): number {

        switch (type) {
          case UserType.TRAINER:
            return store.trainersPage().page ? store.trainersPage().page.number : 0;
          case UserType.TRAINEE:
            return store.traineePage().page ? store.traineePage().page.number : 0;
        }

      },

      retrieveTrainers() {

        const page = store.trainersPage().page;

        if (!page || page.totalElements == 0) {
          this.loadOptions(UserType.TRAINER, false)
          return;
        }

        this.loadOptions(UserType.TRAINER, true);

      },

      retrieveTrainees() {

        const page = store.traineePage().page;

        if (!page || page.totalElements == 0) {
          this.loadOptions(UserType.TRAINEE, false)
          return;
        }

        this.loadOptions(UserType.TRAINEE, true);

      },

      loadOptions(userType: UserType, next: boolean = true) {

        const page = this.getPage(userType);
        const params = new HttpParams()
          .set("userType", userType.toLowerCase())
          .set("size", 50)
          .set("page", page)


        httpClient.get<Page<User>>(httpConfig.baseUrl + "users", {
          withCredentials: true,
          params: params
        }).subscribe(res => {

          const dataObj: Page<SelectOption<string>> = {
            content: res.content.map(value => {
              return {
                id: value.id,
                name: value.forename + " " + value.surname
              } as SelectOption<string>
            }),
            page: res.page
          }

          switch (userType) {
            case UserType.TRAINEE:
              patchState(store, {
                traineePage: dataObj
              })
              break;

            case UserType.TRAINER:
              patchState(store, {
                trainersPage: dataObj
              })
              break;
          }
        })
      }

    }

  })
)
