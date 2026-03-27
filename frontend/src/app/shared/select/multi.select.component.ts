import {Component, input, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HlmSelectImports} from '@spartan-ng/helm/select';
import {SelectOption} from '@core/http/model/select.option.model';

@Component({
  selector: 'multi-select-component',
  imports: [ReactiveFormsModule, HlmSelectImports],
  template: `
    <div class="flex items-center gap-5 mb-4">
      <label class="font-semibold w-36">{{ label() }}</label>
      <hlm-select-multiple
        class="flex-auto"
        [formControl]="this.control()"
        [itemToString]="itemToString"
        (stateChanged)="onStateChanged($event)">
        <hlm-select-trigger>
          <span hlmSelectValues>
            <span hlmSelectPlaceholder>{{ this.placeholder() }}</span>
            <span hlmSelectValuesContent></span>
          </span>
        </hlm-select-trigger>
        <hlm-select-content *hlmSelectPortal>
          <hlm-select-group>
            @for (item of this.data(); track item.id) {
              <hlm-select-item [value]="item">
                {{ item.name }}
              </hlm-select-item>
            }
          </hlm-select-group>
        </hlm-select-content>
      </hlm-select-multiple>
    </div>
    <div class="flex flex-col gap-0.5">
      <ng-content select="[errors]"></ng-content>
    </div>
  `
})
export class MultiSelectComponent {

  readonly label = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly data = input.required<SelectOption<unknown>[]>();
  readonly onLazyLoad = output<unknown>();
  readonly onShow = output<void>();

  protected readonly itemToString = (item: SelectOption<unknown> | null): string => item?.name?.toString() ?? '';

  protected onStateChanged(state: unknown) {
    const popoverState = typeof state === 'string' ? state : null;

    if (popoverState !== 'open') {
      return;
    }

    this.onShow.emit();
    this.onLazyLoad.emit({});
  }
}
