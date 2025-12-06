import {ChangeDetectionStrategy, Component, input, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {BookDay} from '@features/book/models/book.day.model';
import {DateFormatService} from '@features/book/services/date.format.service';

@Component({
  // use attribute selector so the component attaches to the existing <tr>
  selector: 'tr[book-day-row]',
  imports: [CommonModule, Select, InputNumber, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // bind formGroup and weekend class on host <tr>
  host: {
    '[class.weekend]': 'dateFormatService.isWeekend(day().date)',
  },
  template: `
      <td class="px-2 py-1">
        <div class="flex flex-col">
          <span class="font-medium">{{ dateFormatService.getWeekdayName(day().date) }}</span>
          <span class="text-sm text-gray-600">{{ dateFormatService.formatDate(day().date) }}</span>
        </div>
      </td>

      <td class="px-2 py-1">
        <p-select
          class="w-full"
          formControlName="presence"
          [options]="presenceOptions()"
          optionLabel="label"
          optionValue="value"
          [showClear]="true"
          placeholder="Unbekannt"
          ariaLabel="Anwesenheit"
        ></p-select>
      </td>

      <td class="px-2 py-1">
        <p-select
          class="w-full"
          formControlName="presenceLocation"
          [options]="presenceTypeOptions()"
          optionLabel="label"
          optionValue="value"
          [showClear]="true"
          placeholder="Unbekannt"
          ariaLabel="Ort"
        ></p-select>
      </td>

      <td class="px-2 py-1 text-right">
        <p-input-number
          class="w-20 text-right"
          formControlName="duration"
          [min]="0"
          [max]="24"
          [step]="0.25"
          mode="decimal"
          ariaLabel="Stunden"
        ></p-input-number>
      </td>
  `,
})
export class BookDayRowComponent {
  public readonly formGroup = input.required<FormGroup>();
  public readonly day = input.required<BookDay>();
  public readonly presenceOptions = input.required<{ value: any; label: string }[]>();
  public readonly presenceTypeOptions = input.required<{ value: any; label: string }[]>();

  protected readonly dateFormatService = inject(DateFormatService);
}
