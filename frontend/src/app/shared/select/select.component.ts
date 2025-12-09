import {Component, input, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select, SelectLazyLoadEvent} from 'primeng/select';
import {SelectOption} from '@core/http/model/select.option.model';

@Component({
  selector: 'select-component', imports: [FormsModule, ReactiveFormsModule, Select], template: `
    <div class="flex items-center gap-5 mb-4">
      <label for="job" class="font-semibold w-36">{{ label() }}</label>
      <p-select
        appendTo="body"
        [formControl]="this.control()"
        class="flex-auto"
        (onLazyLoad)="this.onLazyLoad.emit($event)"
        [lazy]="true"
        (onShow)="this.onShow.emit()"
        [options]="this.data()"
        [placeholder]="this.placeholder()">
        <ng-template #item #selectedItem let-item>
          {{ item.name }}
        </ng-template>
      </p-select>
    </div>
    <div class="flex flex-col gap-0.5">
      <ng-content select="[errors]"></ng-content>
    </div>
  `
})
export class SelectComponent {

  readonly label = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly data = input.required<SelectOption<unknown>[]>();
  readonly onLazyLoad = output<SelectLazyLoadEvent>();
  readonly onShow = output<void>();

}
