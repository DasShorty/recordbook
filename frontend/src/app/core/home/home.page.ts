import {ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit} from '@angular/core';
import {UserStore} from '@core/users/state/user.store';
import {LayoutComponent} from '@shared/layout/layout.component';
import {StatisticsStore} from '@features/statistics/state/statistics.store';
import {Authority} from '@core/users/models/users.model';
import {TraineeDashboardComponent} from '@features/statistics/components/trainee.dashboard.component';
import {TrainerDashboardComponent} from '@features/statistics/components/trainer.dashboard.component';
import {AdminDashboardComponent} from '@features/statistics/components/admin.dashboard.component';

@Component({
  selector: 'home-page',
  imports: [
    LayoutComponent,
    TraineeDashboardComponent,
    TrainerDashboardComponent,
    AdminDashboardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <layout-component>
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

        @switch (authority()) {
          @case ('TRAINEE') {
            <trainee-dashboard />
          }
          @case ('TRAINER') {
            <trainer-dashboard />
          }
          @case ('ADMINISTRATOR') {
            <admin-dashboard />
          }
        }
      </div>
    </layout-component>
  `
})
export class HomePage implements OnInit, OnDestroy {

  private readonly userStore = inject(UserStore);
  private readonly statisticsStore = inject(StatisticsStore);

  protected readonly authority = computed(() => this.userStore.getActiveUser().authority);

  ngOnInit(): void {
    const type = this.authority();

    if (type === Authority.TRAINEE) {
      this.statisticsStore.startPolling(() => this.statisticsStore.loadTraineeStatistics());
    } else if (type === Authority.TRAINER) {
      this.statisticsStore.startPolling(() => this.statisticsStore.loadTrainerStatistics());
    } else if (type === Authority.ADMINISTRATOR) {
      this.statisticsStore.startPolling(() => this.statisticsStore.loadAdminStatistics());
    }
  }

  ngOnDestroy(): void {
    this.statisticsStore.stopPolling();
  }
}
