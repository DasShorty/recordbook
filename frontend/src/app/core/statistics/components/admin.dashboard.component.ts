import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {StatisticsStore} from '@core/statistics/state/statistics.store';
import {BoxComponent} from '@shared/layout/box.component';
import {StatWidgetComponent} from '@shared/widgets/stat.widget.component';
import {ChartModule} from 'primeng/chart';

@Component({
  selector: 'admin-dashboard',
  imports: [
    BoxComponent,
    StatWidgetComponent,
    ChartModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `
})
export class AdminDashboardComponent {

  private readonly statisticsStore = inject(StatisticsStore);

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
}
