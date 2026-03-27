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
import {StatWidgetComponent} from '@shared/widgets/stat.widget.component';
import {deepEqual} from '@shared/utils/deep-equal';
import Chart from 'chart.js/auto';

@Component({
  selector: 'trainer-dashboard',
  imports: [
    BoxComponent,
    StatWidgetComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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

      <div class="chart-row">
        <box-component>
          <h3 class="text-lg font-semibold mb-4">Signatur-Status</h3>
          <div class="w-full h-80">
            <canvas #chartCanvas></canvas>
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
export class TrainerDashboardComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
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
  }, {equal: deepEqual});
  private chart: any = null;
  private readonly statisticsStore = inject(StatisticsStore);
  protected readonly trainerStats = computed(() => this.statisticsStore.trainerStats());

  constructor() {
    effect(() => {
      const data = this.trainerSignatureChartData();
      if (this.chartCanvas && data.labels.length > 0) {
        this.updateChart(data);
      }
    });
  }

  ngAfterViewInit() {
    const data = this.trainerSignatureChartData();
    if (data.labels.length > 0) {
      this.updateChart(data);
    }
  }

  private updateChart(data: any) {
    if (!this.chartCanvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
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
