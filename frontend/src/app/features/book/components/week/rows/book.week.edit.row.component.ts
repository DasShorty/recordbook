import {ChangeDetectionStrategy, Component, computed, inject, input,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BookDay} from '@features/book/models/book.day.model';
import {Presence, PresenceDisplay, PresenceType,} from '@features/book/models/presence.type';
import {DateFormatService} from '@features/book/services/date.format.service';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: '[book-week-edit-row]',
  imports: [CommonModule, ReactiveFormsModule, Select, InputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.weekend]': 'dateFormatService.isWeekend(bookDay().date)',
    'class': 'edit-row'
  },
  template: `
    <ng-container [formGroup]="formGroup()">
      <td class="px-2 py-1">
        <div class="flex flex-col">
          <span class="font-medium">{{
              dateFormatService.getWeekdayName(bookDay().date)
            }}</span>
          <span class="text-sm text-gray-600">{{
              dateFormatService.formatDate(bookDay().date)
            }}</span>
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
          fluid
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
          fluid
        ></p-select>
      </td>

      <td class="px-2 py-1 text-right flex gap-1 flex-row">
        <p-input-number
          class="text-right"
          formControlName="hours"
          [min]="0"
          [max]="24"
          [step]="1"
          [showButtons]="true"
          ariaLabel="Stunden"
          fluid
        ></p-input-number>
        <p-input-number
          class="text-right"
          formControlName="minutes"
          [min]="0"
          [max]="59"
          [step]="1"
          [showButtons]="true"
          ariaLabel="Minuten"
          fluid
        ></p-input-number>
      </td>
    </ng-container>
  `,
  styles: [
    `
      :host.weekend {
        background-color: rgba(0, 0, 0, 0.03);
      }

      :host td {
        padding: 0.5rem;
      }
    `,
  ],
})
export class BookWeekEditRowComponent {
  public readonly bookDay = input.required<BookDay>();
  public readonly formGroup = input.required<FormGroup>();

  protected readonly dateFormatService = inject(DateFormatService);

  protected readonly presenceOptions = computed(() =>
    Object.values(Presence).map((v) => ({
      value: v,
      label: PresenceDisplay.getPresenceDisplay(v as Presence),
    }))
  );

  protected readonly presenceTypeOptions = computed(() =>
    Object.values(PresenceType).map((v) => ({
      value: v,
      label: PresenceDisplay.getPresenceType(v as PresenceType),
    }))
  );
}
