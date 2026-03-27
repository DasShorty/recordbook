import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  QueryList,
  ViewChildren
} from '@angular/core';
import {StatisticsStore} from '@features/statistics/state/statistics.store';
import {BoxComponent} from '@shared/layout/box.component';
import {StatWidgetComponent} from '@shared/widgets/stat.widget.component';
import {deepEqual} from '@shared/utils/deep-equal';
import Chart from 'chart.js/auto';

@Component({
  selector: 'trainee-dashboard',
  imports: [
    BoxComponent,
    StatWidgetComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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

      <div class="chart-row">
        <box-component>
          <h3 class="text-lg font-semibold mb-4">Anwesenheitsverteilung</h3>
          <div class="w-full h-80">
            <canvas #presenceChartCanvas></canvas>
          </div>
        </box-component>
        <box-component>
          <h3 class="text-lg font-semibold mb-4">Arbeitsort-Verteilung</h3>
          <div class="w-full h-80">
            <canvas #locationChartCanvas></canvas>
          </div>
        </box-component>
      </div>

      <div class="chart-row">
        <box-component>
          <h3 class="text-lg font-semibold mb-4">Stunden pro Woche</h3>
          <div class="w-full h-80">
            <canvas #weeklyHoursChartCanvas></canvas>
          </div>
        </box-component>
        <box-component>
          <h3 class="text-lg font-semibold mb-4">Stunden-Zeitverlauf</h3>
          <div class="w-full h-80">
            <canvas #weeklyHoursLineChartCanvas></canvas>
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
export class TraineeDashboardComponent implements AfterViewInit {

  @ViewChildren('presenceChartCanvas, locationChartCanvas, weeklyHoursChartCanvas, weeklyHoursLineChartCanvas', {read: ElementRef}) chartCanvases!: QueryList<ElementRef>;
  protected readonly completedWeeksPercentage = computed(() => {
    const stats = this.traineeStats();
    if (!stats || stats.totalWeeks === 0) return '';
    const percentage = Math.round((stats.completedWeeks / stats.totalWeeks) * 100);
    return `${percentage}%`;
  });
  protected readonly formattedTotalHours = computed(() => {
    const stats = this.traineeStats();
    if (!stats) return '0';
    return `${stats.totalHours}h`;
  });
  protected readonly presenceChartData = computed(() => {
    const stats = this.traineeStats() as any;
    if (!stats) return {labels: [], datasets: []};

    return {
      labels: ['Anwesend', 'Urlaub', 'Abwesend'],
      datasets: [{
        data: [stats.presentDays || 0, stats.vacationDays || 0, stats.absenceDays || 0],
        backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899']
      }]
    };
  });
  protected readonly locationChartData = computed(() => {
    const stats = this.traineeStats() as any;
    if (!stats) return {labels: [], datasets: []};

    return {
      labels: ['Betrieb', 'Schule', 'ÜBA'],
      datasets: [{
        data: [stats.workDays || 0, stats.schoolDays || 0, stats.guidanceDays || 0],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
      }]
    };
  });
  protected readonly weeklyHoursChartData = computed(() => {
    const stats = this.traineeStats() as any;
    if (!stats || !stats.weeklyData) return {labels: [], datasets: []};

    const weeks = Array.isArray(stats.weeklyData) ? stats.weeklyData : [];
    return {
      labels: weeks.map((w: any) => `W${w.week || w.weekNumber}`),
      datasets: [{
        label: 'Stunden',
        data: weeks.map((w: any) => w.hours || w.totalHours || 0),
        backgroundColor: '#6366f1'
      }]
    };
  }, {equal: deepEqual});
  protected readonly weeklyHoursLineChartData = computed(() => {
    const stats = this.traineeStats() as any;
    if (!stats || !stats.weeklyData) return {labels: [], datasets: []};

    const weeks = Array.isArray(stats.weeklyData) ? stats.weeklyData : [];
    const accumulated = weeks.reduce((acc: number[], w: any, i: number) => {
      acc.push((acc[i - 1] || 0) + (w.hours || w.totalHours || 0));
      return acc;
    }, [] as number[]);

    return {
      labels: weeks.map((w: any) => `W${w.week || w.weekNumber}`),
      datasets: [{
        label: 'Kumulierte Stunden',
        data: accumulated,
        borderColor: '#8b5cf6',
        fill: false,
        tension: 0.4
      }]
    };
  }, {equal: deepEqual});
  private charts: any[] = [];
  private presenceChartRef!: ElementRef;
  private locationChartRef!: ElementRef;
  private weeklyHoursChartRef!: ElementRef;
  private weeklyHoursLineChartRef!: ElementRef;
  private readonly statisticsStore = inject(StatisticsStore);
  protected readonly traineeStats = computed(() => this.statisticsStore.traineeStats());

  constructor() {
    effect(() => {
      this.presenceChartData();
      this.locationChartData();
      this.weeklyHoursChartData();
      this.weeklyHoursLineChartData();
      this.updateCharts();
    });
  }

  ngAfterViewInit() {
    if (this.chartCanvases.length >= 4) {
      this.presenceChartRef = this.chartCanvases.get(0)!;
      this.locationChartRef = this.chartCanvases.get(1)!;
      this.weeklyHoursChartRef = this.chartCanvases.get(2)!;
      this.weeklyHoursLineChartRef = this.chartCanvases.get(3)!;
      this.updateCharts();
    }
  }

  private updateCharts() {
    this.destroyCharts();

    if (this.presenceChartRef?.nativeElement) {
      const ctx = this.presenceChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, {
        type: 'pie' as any,
        data: this.presenceChartData(),
        options: {responsive: true, maintainAspectRatio: true, plugins: {legend: {position: 'bottom' as const}}}
      }));
    }

    if (this.locationChartRef?.nativeElement) {
      const ctx = this.locationChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, {
        type: 'pie' as any,
        data: this.locationChartData(),
        options: {responsive: true, maintainAspectRatio: true, plugins: {legend: {position: 'bottom' as const}}}
      }));
    }

    if (this.weeklyHoursChartRef?.nativeElement) {
      const ctx = this.weeklyHoursChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, {
        type: 'bar' as any,
        data: this.weeklyHoursChartData(),
        options: {responsive: true, maintainAspectRatio: true, plugins: {legend: {display: false}}}
      }));
    }

    if (this.weeklyHoursLineChartRef?.nativeElement) {
      const ctx = this.weeklyHoursLineChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, {
        type: 'line' as any,
        data: this.weeklyHoursLineChartData(),
        options: {responsive: true, maintainAspectRatio: true, plugins: {legend: {display: true}}}
      }));
    }
  }

  private destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }
}






