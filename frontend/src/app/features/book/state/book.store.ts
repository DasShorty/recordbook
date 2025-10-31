import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Book} from '@features/book/models/book.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {Optional} from '@shared/data/optional';

export const BookStore = signalStore(
  {providedIn: 'root'},
  withState({
    activeBook: {} as Book,
    loading: false,
    error: 0 as number | undefined
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      async getOwnBook() {

        patchState(store, {
          error: undefined,
          loading: true
        });

        const response = await firstValueFrom(httpClient.get<Book>(httpConfig.baseUrl + "books/me", {
          withCredentials: true,
          observe: 'response'
        }));

        if (!response.ok || response.body === null) {
          patchState(store, {
            error: response.status,
            loading: false
          });
          return;
        }

        patchState(store, {
          error: undefined,
          activeBook: response.body,
          loading: false
        });
      },

      async createOwnBook(traineeId: string, trainerIds: string[], jobId: string): Promise<Optional<Book>> {

        const res = await firstValueFrom(httpClient.post<Book>(httpConfig.baseUrl + "books", {
          trainee: traineeId,
          trainers: trainerIds,
          job: jobId
        }, {
          withCredentials: true,
          observe: 'response'
        }));

        if (!res.ok || res.body === null) {
          return Optional.empty();
        }

        return Optional.of(res.body);
      }

    }

  })
)
