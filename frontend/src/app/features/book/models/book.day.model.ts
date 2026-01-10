import {Presence, PresenceType} from '@features/book/models/presence.type';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export type BookDayId = Brand<string, "BookDayId">

export type BookDay = {
  id: BookDayId,
  date: string,
  hours: number,
  minutes: number,
  presence: Presence,
  presenceLocation: PresenceType
}

export namespace BookDay {
  export function getFormGroup(bookDay: BookDay, disabled: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl<BookDayId>({value: bookDay.id, disabled: disabled}),
      date: new FormControl<string>({value: bookDay.date, disabled: disabled}),
      presence: new FormControl<Presence>({value: bookDay.presence, disabled: disabled}),
      presenceLocation: new FormControl<PresenceType>({value: bookDay.presenceLocation, disabled: disabled}),
      hours: new FormControl<number>({
        value: bookDay.hours,
        disabled: disabled
      }, {validators: [Validators.min(0), Validators.max(24)]}),
      minutes: new FormControl<number>({
        value: bookDay.minutes,
        disabled: disabled
      }, {validators: [Validators.min(0), Validators.max(59)]}),
    });

  }
}
