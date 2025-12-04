import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Book} from '@features/book/models/book.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpConfig} from '@environment/environment';

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

      getOwnBook() {

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
          },
          error: (err) => {
            patchState(store, {
              error: err?.status ?? 500,
              loading: false
            });
          }
        })

      }

    }

  })
)
