import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Book} from '@features/book/models/book.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpConfig} from '@environment/environment';
import {HttpParams} from '@angular/common/http';
import {QueryResult} from '@core/http/http.model';
import {Consumer} from '@shared/data/consumer';
import {Page} from '@shared/http/model/page.model';

export const BookStore = signalStore(
  {providedIn: 'root'},
  withState({
    activeBook: {} as Book,
    loading: false,
    error: 0 as number | undefined,
    // manager-like state merged here
    books: [] as Book[],
    page: 0,
    size: 10,
    total: 0
  }),
  withMethods(store => {

    const httpClient = inject(HttpClient);

    return {

      getOwnBook(res: Consumer<Book>) {

        patchState(store, {
          error: undefined,
          loading: true
        });

        httpClient.get<Book>(httpConfig.baseUrl + "books/me", {
          withCredentials: true,
          observe: 'response'
        }).subscribe({
          next: (response) => {
            if (!response || response.body == null) {
              patchState(store, {
                error: response?.status,
                loading: false
              });
              return;
            }

            patchState(store, {
              error: undefined,
              activeBook: response.body,
              loading: false
            });

            res(response.body);
          },
          error: (err) => {
            patchState(store, {
              error: err?.status ?? 500,
              loading: false
            });
          }
        })

      },

      // ---- Manager-like methods migrated into BookStore ----

      getBooks(page: number, size: number) {

        const params = new HttpParams()
          .set('page', String(page))
          .set('size', String(size));

        httpClient.get<Page<Book>>(httpConfig.baseUrl + "books", {
          withCredentials: true,
          params: params
        }).subscribe({
          next: (res) => {
            patchState(store, {
              books: res.content,
              page: res.page.number,
              size: res.page.size,
              total: res.page.totalElements
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
