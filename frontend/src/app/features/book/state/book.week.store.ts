import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {BookWeek} from '@features/book/models/book.week.model';
import {BookDay} from '@features/book/models/book.day.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

      getWeek(week: number, year: number, bookId: string) {

        patchState(store, {
          loading: true,
          error: undefined
        });

        const url = `${httpConfig.baseUrl}books/${bookId}/weeks/${year}/${week}`;
        httpClient.get<BookWeek>(url, {
          observe: "response",
          withCredentials: true
        }).subscribe({
          next: (res) => {
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
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              error: err?.status ?? 500
            });
          }
        });

      },

      updateWeek(weekId: string, bookId: string, text: string, days: BookDay[]) {
        patchState(store, {
          loading: true,
          error: undefined
        });

        const updatePayload = {
          id: weekId,
          text: text,
          days: days.map(d => ({
            id: d.id,
            hours: d.hours,
            minutes: d.minutes,
            presence: d.presence,
            presenceLocation: d.presenceLocation
          }))
        };

        const url = `${httpConfig.baseUrl}books/${bookId}/weeks/${weekId}`;
        httpClient.put<BookWeek>(url, updatePayload, {
          observe: "response",
          withCredentials: true
        }).subscribe({
          next: (res) => {
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
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              error: err?.status ?? 500
            });
          }
        });
      },

      setWeekUpdated(bookId: string, weekId: string) {
        patchState(store, {
          loading: true,
          error: undefined
        });

        httpClient.patch<BookWeek>(`${httpConfig.baseUrl}books/${bookId}/weeks/${weekId}/submit`, {}, {
          observe: "response",
          withCredentials: true
        })
          .subscribe({
            next: (res) => {
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
            },
            error: (err) => {
              patchState(store, {
                loading: false,
                error: err?.status ?? 500
              });
            }
          });
      }

    }

  })
)
