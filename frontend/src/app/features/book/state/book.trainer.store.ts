import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpConfig} from '@environment/environment';
import {Consumer} from '@shared/data/consumer';

export const BookTrainerStore = signalStore(
  {providedIn: 'root'},
  withState({}),
  withMethods((store) => {

    const httpClient = inject(HttpClient);

    return {

      denyWeek(weekId: BookWeekId, res: Consumer<{ ok: boolean, data: BookWeek | null }>) {

      },

      acceptWeek(weekId: BookWeekId, res: Consumer<{ ok: boolean, data: BookWeek | null }>) {

        httpClient.patch<BookWeek>(`${httpConfig.baseUrl}books/weeks/${weekId}/accept`, {}, {
          observe: 'response',
          withCredentials: true
        }).subscribe(value => {
          res({
            ok: value.ok,
            data: value.body
          });
        });
      },

    }

  })
)
