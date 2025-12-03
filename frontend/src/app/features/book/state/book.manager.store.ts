import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Book} from '@features/book/models/book.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Optional} from '@shared/data/optional';
import {firstValueFrom} from 'rxjs';
import {httpConfig} from '@environment/environment';
import {QueryResult} from '@core/http/http.model';
import {Consumer} from '@shared/data/consumer';

export const BookManagerStore = signalStore(
  {providedIn: 'root'},
  withState({
    books: [] as Book[],
    limit: 10,
    offset: 0,
    total: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      async getBooks(offset: number, limit: number): Promise<Optional<QueryResult<Book[]>>> {

        const res = await firstValueFrom(httpClient.get<QueryResult<Book[]>>(httpConfig.baseUrl + "books", {
          withCredentials: true,
          params: {
            'offset': offset,
            'limit': limit
          },
          observe: 'response'
        }));

        if (!res.ok || res.body == null) {
          return Optional.empty();
        }

        return Optional.of(res.body);
      },

      loadBooks(offset: number, limit: number, onFinished: Consumer<boolean>) {

        this.getBooks(offset, limit).then(value => {

          onFinished(value.isPresent());

          if (value.isPresent()) {

            const data = value.get();

            patchState(store, {
              books: data.data,
              offset: data.offset,
              limit: data.limit,
              total: data.total
            });
          }

        })

      },

      async createBook(traineeId: string, trainerId: string): Promise<Optional<Book>> {

        const res = await firstValueFrom(httpClient.post<Book>(httpConfig.baseUrl + "books", {
          trainee: traineeId,
          trainer: trainerId,
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
