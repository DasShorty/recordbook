import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {Select} from 'primeng/select';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Presence, PresenceDisplay, PresenceType} from '@features/book/models/presence.type';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'book-day',
  imports: [
    Select,
    ReactiveFormsModule,
    InputNumber
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr>
      <form [formGroup]="form()">
        <td>
          <p-select [options]="Object.keys(Presence)" formControlName="presence">
            <ng-template #item let-presence>
              <span>{{ PresenceDisplay.getPresenceDisplay(presence) }}</span>
            </ng-template>

            <ng-template #selectedItem let-presence>
              <span>{{ PresenceDisplay.getPresenceDisplay(presence) }}</span>
            </ng-template>
          </p-select>
        </td>
        <td>
          <p-select [options]="Object.keys(PresenceType)" formControlName="presenceType">

            <ng-template #item let-presenceType>
              <span>{{ PresenceDisplay.getPresenceType(presenceType) }}</span>
            </ng-template>

            <ng-template #selectedItem let-presenceType>
              <span>{{ PresenceDisplay.getPresenceType(presenceType) }}</span>
            </ng-template>

          </p-select>
        </td>
        <td>
          <p-input-number formControlName="duration"></p-input-number>
        </td>
      </form>
    </tr>
  `
})
export class BookDayComponent {

  protected readonly form = signal(new FormGroup({
    // date is ISO string (yyyy-MM-dd) from backend
    date: new FormControl<string | null>(null, Validators.required),
    duration: new FormControl<number>(0, Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.max(24)
    ])),
    presence: new FormControl<Presence | null>(null, Validators.required),
    presenceLocation: new FormControl<PresenceType | null>(null, Validators.required)
  }))

  protected readonly Object = Object;
  protected readonly Presence = Presence;
  protected readonly PresenceType = PresenceType;
  protected readonly PresenceDisplay = PresenceDisplay;
}

