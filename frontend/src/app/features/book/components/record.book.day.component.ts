import {Component, signal} from '@angular/core';
import {Select} from 'primeng/select';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Presence, PresenceDisplay, PresenceType} from '@features/book/models/presence.type';
import {Qualification} from '@features/job/models/qualification.model';
import {InputNumber} from 'primeng/inputnumber';
import {MultiSelect} from 'primeng/multiselect';

@Component({
  selector: 'record-book-day-component',
  imports: [
    Select,
    ReactiveFormsModule,
    InputNumber,
    MultiSelect
  ],
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
        <td>
          <p-multiSelect [options]="[]" formControlName="qualifications" optionLabel="Qualifikationen"></p-multiSelect>
        </td>
      </form>
    </tr>
  `
})
export class RecordBookDayComponent {

  protected readonly form = signal(new FormGroup({
    date: new FormControl<Date | null>(null, Validators.required),
    duration: new FormControl<number>(0, Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.max(24)
    ])),
    presence: new FormControl<Presence | null>(null, Validators.required),
    presenceLocation: new FormControl<PresenceType | null>(null, Validators.required),
    qualifications: new FormControl<Qualification[] | null>(null, Validators.required)
  }))

  protected readonly Object = Object;
  protected readonly Presence = Presence;
  protected readonly PresenceType = PresenceType;
  protected readonly PresenceDisplay = PresenceDisplay;
}
