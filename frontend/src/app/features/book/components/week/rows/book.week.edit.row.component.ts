import {ChangeDetectionStrategy, Component, computed, inject, input,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BookDay} from '@features/book/models/book.day.model';
import {Presence, PresenceDisplay, PresenceType,} from '@features/book/models/presence.type';
import {DateFormatService} from '@features/book/services/date.format.service';

@Component({
  selector: '[book-week-edit-row]',
  imports: [CommonModule, ReactiveFormsModule],
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
        <select
          class="w-full border rounded-md px-2 py-1 text-sm"
          formControlName="presence"
          aria-label="Anwesenheit"
        >
          <option [ngValue]="null">Unbekannt</option>
          @for (opt of presenceOptions(); track opt.value) {
            <option [ngValue]="opt.value">{{ opt.label }}</option>
          }
        </select>
      </td>

      <td class="px-2 py-1">
        <select
          class="w-full border rounded-md px-2 py-1 text-sm"
          formControlName="presenceLocation"
          aria-label="Ort"
        >
          <option [ngValue]="null">Unbekannt</option>
          @for (opt of presenceTypeOptions(); track opt.value) {
            <option [ngValue]="opt.value">{{ opt.label }}</option>
          }
        </select>
      </td>

      <td class="px-2 py-1 text-right flex gap-1 flex-row">
        <input
          class="w-20 text-right border rounded-md px-2 py-1 text-sm"
          type="number"
          formControlName="hours"
          min="0"
          max="24"
          step="1"
          aria-label="Stunden"
          placeholder="Std"
        />
        <input
          class="w-20 text-right border rounded-md px-2 py-1 text-sm"
          type="number"
          formControlName="minutes"
          min="0"
          max="59"
          step="1"
          aria-label="Minuten"
          placeholder="Min"
        />
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
