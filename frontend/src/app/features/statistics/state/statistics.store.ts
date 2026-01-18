import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpConfig} from '@environment/environment';
import {AdminStatistics, TraineeStatistics, TrainerStatistics} from '@features/statistics/models/statistics.model';
import {interval, Subscription} from 'rxjs';

interface StatisticsState {
  traineeStats: TraineeStatistics | null;
  trainerStats: TrainerStatistics | null;
  adminStats: AdminStatistics | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  traineeStats: null,
  trainerStats: null,
  adminStats: null,
  loading: false,
  error: null
};

export const StatisticsStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store) => {
    const httpClient = inject(HttpClient);
    let pollingSubscription: Subscription | null = null;

    return {
      loadTraineeStatistics() {
        patchState(store, {loading: true, error: null});

        httpClient.get<TraineeStatistics>(`${httpConfig.baseUrl}statistics/trainee`, {
          withCredentials: true
        }).subscribe({
          next: (stats) => {
            patchState(store, {
              traineeStats: stats,
              loading: false,
              error: null
            });
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              error: err?.message ?? 'Failed to load trainee statistics'
            });
          }
        });
      },

      loadTrainerStatistics() {
        patchState(store, {loading: true, error: null});

        httpClient.get<TrainerStatistics>(`${httpConfig.baseUrl}statistics/trainer`, {
          withCredentials: true
        }).subscribe({
          next: (stats) => {
            patchState(store, {
              trainerStats: stats,
              loading: false,
              error: null
            });
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              error: err?.message ?? 'Failed to load trainer statistics'
            });
          }
        });
      },

      loadAdminStatistics() {
        patchState(store, {loading: true, error: null});

        httpClient.get<AdminStatistics>(`${httpConfig.baseUrl}statistics/admin`, {
          withCredentials: true
        }).subscribe({
          next: (stats) => {
            patchState(store, {
              adminStats: stats,
              loading: false,
              error: null
            });
          },
          error: (err) => {
            patchState(store, {
              loading: false,
              error: err?.message ?? 'Failed to load admin statistics'
            });
          }
        });
      },

      startPolling(loadFn: () => void) {
        loadFn();

        if (pollingSubscription) {
          pollingSubscription.unsubscribe();
        }

        pollingSubscription = interval(10000).subscribe(() => {
          loadFn();
        });
      },

      stopPolling() {
        if (pollingSubscription) {
          pollingSubscription.unsubscribe();
          pollingSubscription = null;
        }
      },

      reset() {
        this.stopPolling();
        patchState(store, initialState);
      }
    };
  })
);
