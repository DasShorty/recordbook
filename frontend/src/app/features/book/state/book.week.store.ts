import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {BookWeek} from '@features/book/models/book.week.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';

export const BookWeekStore = signalStore(
  {providedIn: 'root'},
  withState({
    week: {} as BookWeek,
    loading: false,
    error: 0 as number | undefined
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      async createWeek(week: number, year: number, bookId: string) {

        const res = await firstValueFrom(httpClient.post<BookWeek>(httpConfig.baseUrl + "books/" + bookId + "/weeks", {
          calendarWeek: week,
          year: year
        }, {
          withCredentials: true,
          observe: 'response'
        }));

      },

      async getWeek(week: number, year: number, bookId: string) {

        patchState(store, {
          loading: true,
          error: undefined
        });

        const res = await firstValueFrom(httpClient.get<BookWeek>(httpConfig.baseUrl + "books/" + bookId + "/weeks/" + year + "/" + week, {
          observe: "response",
          withCredentials: true
        }));

        if (!res.ok || res.body === null) {
          patchState(store, {
            loading: false,
            error: res.status
          });
          return;
        }

        patchState(store, {
          loading: false,
          error: undefined,
          week: res.body
        });

      }

    }

  })
)
