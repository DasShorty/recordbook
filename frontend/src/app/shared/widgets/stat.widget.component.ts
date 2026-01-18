import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {BoxComponent} from '@shared/layout/box.component';

@Component({
  selector: 'stat-widget',
  imports: [BoxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <box-component>
      <div class="flex items-center gap-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <i [class]="icon() + ' text-primary text-xl'"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-500 mb-1">{{ title() }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ value() }} <span
            class="text-xs font-normal text-gray-400 mt-1">{{ subtitle() }}</span></p>
        </div>
        @if (trend() !== undefined) {
          <div [class]="trend()! >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-medium">
            <i [class]="trend()! >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            {{ trend()! >= 0 ? '+' : '' }}{{ trend() }}%
          </div>
        }
      </div>
    </box-component>
  `
})
export class StatWidgetComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input<string>('pi pi-chart-bar');
  readonly subtitle = input<string>();
  readonly trend = input<number>();
}
