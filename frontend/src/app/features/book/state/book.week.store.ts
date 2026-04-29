import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {BookWeek, BookWeekId} from '@features/book/models/book.week.model';
import {BookDay} from '@features/book/models/book.day.model';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpConfig} from '@environment/environment';
import {BookId} from '@features/book/models/book.model';
import {Page} from '@core/http/model/page.model';
import {Observable, tap} from 'rxjs';

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

      deleteWeek(weekId: BookWeekId) {
        return httpClient.delete(`${httpConfig.baseUrl}books/weeks/${weekId}`, {
          withCredentials: true
        });
      },

      getWeeks(bookId: BookId, page: number, size: number) {
        return httpClient.get<Page<BookWeek>>(`${httpConfig.baseUrl}books/${bookId}/weeks`, {
          withCredentials: true,
          params: {
            page: page,
            size: size
          }
        });
      },

      loadWeek(week: number, year: number, bookId: BookId) {
        return httpClient.get<BookWeek>(`${httpConfig.baseUrl}books/${bookId}/weeks/${year}/${week}`, {
          withCredentials: true
        });
      },

      updateWeekRequest(weekId: string, bookId: string, text: string, days: BookDay[]) {
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
        return httpClient.put<BookWeek>(url, updatePayload, {
          withCredentials: true
        });
      },

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

        this.updateWeekRequest(weekId, bookId, text, days).subscribe({
          next: (updatedWeek) => {
            patchState(store, {
              loading: false,
              error: undefined,
              week: updatedWeek
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

      submitWeekToTrainer(weekId: string): Observable<BookWeek> {
        patchState(store, {
          loading: true,
          error: undefined
        });

        return httpClient.patch<BookWeek>(`${httpConfig.baseUrl}books/weeks/${weekId}/submit`, {}, {
          withCredentials: true
        }).pipe(
          tap({
            next: (submittedWeek) => {
              patchState(store, {
                loading: false,
                error: undefined,
                week: submittedWeek
              });
            },
            error: (err) => {
              patchState(store, {
                loading: false,
                error: err?.status ?? 500
              });
            }
          })
        );
      }

    }

  })
)
