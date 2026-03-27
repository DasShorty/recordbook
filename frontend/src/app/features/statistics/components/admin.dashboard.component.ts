import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import {StatisticsStore} from '@features/statistics/state/statistics.store';
import {BoxComponent} from '@shared/layout/box.component';
import {deepEqual} from '@shared/utils/deep-equal';
import {StatWidgetComponent} from '@shared/widgets/stat.widget.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'admin-dashboard',
  imports: [
    BoxComponent,
    StatWidgetComponent
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

      <div class="chart-row">
        <box-component>
          <h3 class="text-lg font-semibold mb-4">Benutzer nach Typ</h3>
          <div class="w-full h-80">
            <canvas #userTypeChart></canvas>
          </div>
        </box-component>
        <box-component>
          <h3 class="text-lg font-semibold mb-4">Wochen-Status</h3>
          <div class="w-full h-80">
            <canvas #weeksChart></canvas>
          </div>
        </box-component>
      </div>
    } @else {
      <div class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
        <p class="mt-2 text-gray-500">Lade Statistiken...</p>
      </div>
    }
  `,
  styles: `
    .chart-row {
      margin-top: 2rem;
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  `
})
export class AdminDashboardComponent implements AfterViewInit {

  @ViewChild('userTypeChart') userTypeChart!: ElementRef;
  @ViewChild('weeksChart') weeksChart!: ElementRef;
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
  }, {equal: deepEqual});
  private userTypeChartInstance: any = null;
  private weeksChartInstance: any = null;
  private readonly statisticsStore = inject(StatisticsStore);
  protected readonly adminStats = computed(() => this.statisticsStore.adminStats());

  constructor() {
    effect(() => {
      const userTypeData = this.adminUserTypeChartData();
      const weeksData = this.adminWeeksChartData();
      if (this.userTypeChart && userTypeData.labels.length > 0) {
        this.updateUserTypeChart(userTypeData);
      }
      if (this.weeksChart && weeksData.labels.length > 0) {
        this.updateWeeksChart(weeksData);
      }
    });
  }

  ngAfterViewInit() {
    const userTypeData = this.adminUserTypeChartData();
    const weeksData = this.adminWeeksChartData();
    if (userTypeData.labels.length > 0) {
      this.updateUserTypeChart(userTypeData);
    }
    if (weeksData.labels.length > 0) {
      this.updateWeeksChart(weeksData);
    }
  }

  private updateUserTypeChart(data: any) {
    if (!this.userTypeChart) return;

    if (this.userTypeChartInstance) {
      this.userTypeChartInstance.destroy();
    }

    const ctx = this.userTypeChart.nativeElement.getContext('2d');
    this.userTypeChartInstance = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom' as const
          }
        }
      }
    });
  }

  private updateWeeksChart(data: any) {
    if (!this.weeksChart) return;

    if (this.weeksChartInstance) {
      this.weeksChartInstance.destroy();
    }

    const ctx = this.weeksChart.nativeElement.getContext('2d');
    this.weeksChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom' as const
          }
        }
      }
    });
  }
}
