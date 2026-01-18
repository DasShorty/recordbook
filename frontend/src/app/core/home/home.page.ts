import {Component, computed, inject, OnDestroy, OnInit} from '@angular/core';
import {UserStore} from '@core/users/state/user.store';
import {LayoutComponent} from '@shared/layout/layout.component';
import {BoxComponent} from '@shared/layout/box.component';
import {StatWidgetComponent} from '@shared/widgets/stat-widget.component';
import {StatisticsStore} from '@core/statistics/state/statistics.store';
import {Authority, UserType} from '@core/users/models/users.model';
import {ChartModule} from 'primeng/chart';

@Component({
  selector: 'home-page',
  imports: [
    LayoutComponent,
    BoxComponent,
    StatWidgetComponent,
    ChartModule
  ],
  template: `
    <layout-component>
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

        @switch (authority()) {
          @case ('TRAINEE') {
            @if (traineeStats()) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <stat-widget
                  title="Gesamte Wochen"
                  [value]="traineeStats()!.totalWeeks"
                  icon="pi pi-calendar"
                />
                <stat-widget
                  title="Abgeschlossene Wochen"
                  [value]="traineeStats()!.completedWeeks"
                  icon="pi pi-check-circle"
                  [subtitle]="completedWeeksPercentage()"
                />
                <stat-widget
                  title="Signierte Wochen"
                  [value]="traineeStats()!.signedWeeks"
                  icon="pi pi-verified"
                />
                <stat-widget
                  title="Gesamtstunden"
                  [value]="formattedTotalHours()"
                  icon="pi pi-clock"
                />
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <box-component>
                  <h3 class="text-lg font-semibold mb-4">Anwesenheitsverteilung</h3>
                  <p-chart type="pie" [data]="presenceChartData()" [options]="pieChartOptions"/>
                </box-component>
                <box-component>
                  <h3 class="text-lg font-semibold mb-4">Arbeitsort-Verteilung</h3>
                  <p-chart type="pie" [data]="locationChartData()" [options]="pieChartOptions"/>
                </box-component>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <box-component>
                  <h3 class="text-lg font-semibold mb-4">Stunden pro Woche</h3>
                  <p-chart type="bar" [data]="weeklyHoursChartData()" [options]="barChartOptions"/>
                </box-component>
                <box-component>
                  <h3 class="text-lg font-semibold mb-4">Stunden-Zeitverlauf</h3>
                  <p-chart type="line" [data]="weeklyHoursLineChartData()" [options]="lineChartOptions"/>
                </box-component>
              </div>
            } @else {
              <div class="text-center py-8">
                <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
                <p class="mt-2 text-gray-500">Lade Statistiken...</p>
              </div>
            }
          }
          @case ('TRAINER') {
            @if (trainerStats()) {
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <stat-widget
                  title="Betreute Auszubildende"
                  [value]="trainerStats()!.assignedTrainees"
                  icon="pi pi-users"
                />
                <stat-widget
                  title="Offene Signaturen"
                  [value]="trainerStats()!.pendingSignatureWeeks"
                  icon="pi pi-clock"
                  subtitle="Wochen warten auf Signatur"
                />
                <stat-widget
                  title="Signierte Wochen"
                  [value]="trainerStats()!.signedWeeks"
                  icon="pi pi-check-circle"
                />
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <box-component>
                  <h3 class="text-lg font-semibold mb-4">Signatur-Status</h3>
                  <p-chart type="doughnut" [data]="trainerSignatureChartData()" [options]="pieChartOptions"/>
                </box-component>
              </div>
            } @else {
              <div class="text-center py-8">
                <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
                <p class="mt-2 text-gray-500">Lade Statistiken...</p>
              </div>
            }
          }
          @default {
            @if (adminStats()) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <stat-widget
                  title="Gesamte Benutzer"
                  [value]="adminStats()!.totalUsers"
                  icon="pi pi-users"
                />
                <stat-widget
                  title="Auszubildende"
                  [value]="adminStats()!.totalTrainees"
                  icon="pi pi-user"
                />
                <stat-widget
                  title="Ausbilder"
                  [value]="adminStats()!.totalTrainers"
                  icon="pi pi-id-card"
                />
                <stat-widget
                  title="Berichtshefte"
                  [value]="adminStats()!.totalBooks"
                  icon="pi pi-book"
                />
                <stat-widget
                  title="Gesamte Wochen"
                  [value]="adminStats()!.totalWeeks"
                  icon="pi pi-calendar"
                />
                <stat-widget
                  title="Abgeschlossene Wochen"
                  [value]="adminStats()!.completedWeeks"
                  icon="pi pi-check-circle"
                />
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <box-component>
                  <h3 class="text-lg font-semibold mb-4">Benutzer nach Typ</h3>
                  <p-chart type="pie" [data]="adminUserTypeChartData()" [options]="pieChartOptions"/>
                </box-component>
                <box-component>
                  <h3 class="text-lg font-semibold mb-4">Wochen-Status</h3>
                  <p-chart type="doughnut" [data]="adminWeeksChartData()" [options]="pieChartOptions"/>
                </box-component>
              </div>
            } @else {
              <div class="text-center py-8">
                <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
                <p class="mt-2 text-gray-500">Lade Statistiken...</p>
              </div>
            }
          }
        }
      </div>
    </layout-component>
  `
})
export class HomePage implements OnInit, OnDestroy {

  protected readonly userStore = inject(UserStore);
  protected readonly statisticsStore = inject(StatisticsStore);

  protected readonly authority = computed(() => this.userStore.getActiveUser().authority);
  protected readonly traineeStats = computed(() => this.statisticsStore.traineeStats());
  protected readonly trainerStats = computed(() => this.statisticsStore.trainerStats());
  protected readonly adminStats = computed(() => this.statisticsStore.adminStats());

  protected readonly pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  protected readonly barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stunden'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Kalenderwoche'
        }
      }
    }
  };

  protected readonly lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stunden'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Kalenderwoche'
        }
      }
    }
  };

  protected readonly completedWeeksPercentage = computed(() => {
    const stats = this.traineeStats();
    if (!stats || stats.totalWeeks === 0) return '0%';
    const percentage = Math.round((stats.completedWeeks / stats.totalWeeks) * 100);
    return `${percentage}% abgeschlossen`;
  });

  protected readonly formattedTotalHours = computed(() => {
    const stats = this.traineeStats();
    if (!stats) return '0h 0m';
    return `${stats.totalHours}h ${stats.totalMinutes}m`;
  });

  protected readonly presenceChartData = computed(() => {
    const stats = this.traineeStats();
    if (!stats) return {labels: [], datasets: []};

    return {
      labels: ['Anwesend', 'Urlaub', 'Abwesend', 'Zeitausgleich'],
      datasets: [{
        data: [
          stats.presenceStatistics.presentDays,
          stats.presenceStatistics.vacationDays,
          stats.presenceStatistics.absenceDays,
          stats.presenceStatistics.compensatoryTimeDays
        ],
        backgroundColor: ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']
      }]
    };
  });

  protected readonly locationChartData = computed(() => {
    const stats = this.traineeStats();
    if (!stats) return {labels: [], datasets: []};

    return {
      labels: ['Betrieb', 'Schule', 'ÜBA'],
      datasets: [{
        data: [
          stats.locationStatistics.workDays,
          stats.locationStatistics.schoolDays,
          stats.locationStatistics.guidanceDays
        ],
        backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7']
      }]
    };
  });

  protected readonly weeklyHoursChartData = computed(() => {
    const stats = this.traineeStats();
    if (!stats) return {labels: [], datasets: []};

    const sortedWeeks = [...stats.weeklyHours].slice(-12);

    return {
      labels: sortedWeeks.map(w => `KW ${w.calendarWeek}`),
      datasets: [{
        label: 'Stunden',
        data: sortedWeeks.map(w => w.totalHours + w.totalMinutes / 60),
        backgroundColor: '#6366f1'
      }]
    };
  });

  protected readonly weeklyHoursLineChartData = computed(() => {
    const stats = this.traineeStats();
    if (!stats) return {labels: [], datasets: []};

    const sortedWeeks = [...stats.weeklyHours];

    return {
      labels: sortedWeeks.map(w => `KW ${w.calendarWeek}/${w.year}`),
      datasets: [{
        label: 'Stunden',
        data: sortedWeeks.map(w => w.totalHours + w.totalMinutes / 60),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  });

  protected readonly trainerSignatureChartData = computed(() => {
    const stats = this.trainerStats();
    if (!stats) return {labels: [], datasets: []};

    return {
      labels: ['Signiert', 'Ausstehend'],
      datasets: [{
        data: [stats.signedWeeks, stats.pendingSignatureWeeks],
        backgroundColor: ['#22c55e', '#f59e0b']
      }]
    };
  });

  protected readonly adminUserTypeChartData = computed(() => {
    const stats = this.adminStats();
    if (!stats) return {labels: [], datasets: []};

    return {
      labels: ['Auszubildende', 'Ausbilder', 'Administratoren'],
      datasets: [{
        data: [
          stats.totalTrainees,
          stats.totalTrainers,
          stats.totalUsers - stats.totalTrainees - stats.totalTrainers
        ],
        backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899']
      }]
    };
  });

  protected readonly adminWeeksChartData = computed(() => {
    const stats = this.adminStats();
    if (!stats) return {labels: [], datasets: []};

    return {
      labels: ['Abgeschlossen', 'In Bearbeitung'],
      datasets: [{
        data: [stats.completedWeeks, stats.totalWeeks - stats.completedWeeks],
        backgroundColor: ['#22c55e', '#94a3b8']
      }]
    };
  });

  ngOnInit(): void {
    const type = this.authority();

    if (type === Authority.TRAINEE) {
      this.statisticsStore.startPolling(() => this.statisticsStore.loadTraineeStatistics());
    } else if (type === Authority.TRAINER) {
      this.statisticsStore.startPolling(() => this.statisticsStore.loadTrainerStatistics());
    } else {
      this.statisticsStore.startPolling(() => this.statisticsStore.loadAdminStatistics());
    }
  }

  ngOnDestroy(): void {
    this.statisticsStore.stopPolling();
  }
}
