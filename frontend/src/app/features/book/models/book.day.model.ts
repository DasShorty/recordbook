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
  export function getFormGroup(bookDay: BookDay): FormGroup {
    return new FormGroup({
      id: new FormControl<BookDayId>(bookDay.id),
      date: new FormControl<string>(bookDay.date),
      presence: new FormControl<Presence>(bookDay.presence),
      presenceLocation: new FormControl<PresenceType>(bookDay.presenceLocation),
      hours: new FormControl<number>(bookDay.hours, {validators: [Validators.min(0), Validators.max(24)]}),
      minutes: new FormControl<number>(bookDay.minutes, {validators: [Validators.min(0), Validators.max(59)]}),
    });
  }
}
