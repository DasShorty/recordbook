import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Book} from '@features/book/models/book.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import {Consumer} from '@shared/data/consumer';
import {httpConfig} from '@environment/environment';
import {QueryResult} from '@core/http/http.model';

export const BookManagerStore = signalStore(
  {providedIn: 'root'},
  withState({
    books: [] as Book[],
    size: 10,
    page: 0,
    total: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      getBooks(page: number, size: number) {

        const params = new HttpParams()
          .set('page', String(page))
          .set('size', String(size));

        httpClient.get<QueryResult<Book[]>>(httpConfig.baseUrl + "books", {
          withCredentials: true,
          params: params
        }).subscribe({
          next: (res) => {
            patchState(store, {
              books: res.content,
              page: res.page,
              size: res.size,
              total: res.total
            });
          },
          error: () => {
            // keep previous state; consumer can react via store values
          }
        });

      },

      loadBooks(page: number, size: number, onFinished: Consumer<boolean>) {

        const params = new HttpParams()
          .set('page', String(page))
          .set('size', String(size));

        httpClient.get<QueryResult<Book[]>>(httpConfig.baseUrl + "books", {
          withCredentials: true,
          params: params,
          observe: 'response'
        }).subscribe({
           next: (response) => {
             if (!response || response.body == null) {
               onFinished(false);
               return;
             }

             const data = response.body;

             patchState(store, {
               books: data.content,
               page: data.page,
               size: data.size,
               total: data.total
             });

             onFinished(true);
           },
           error: () => onFinished(false)
         });

      },

      createBook(traineeId: string, trainerId: string, response: Consumer<Book>) {

        httpClient.post<Book>(httpConfig.baseUrl + "books", {
          trainee: traineeId,
          trainer: trainerId,
        }, {
          withCredentials: true
        }).subscribe({
          next: (res) => {
            response(res);
          },
          error: () => response(null as any)
        });
      }

    }

  })
)
