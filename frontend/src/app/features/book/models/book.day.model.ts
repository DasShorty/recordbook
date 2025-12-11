import {Presence, PresenceType} from '@features/book/models/presence.type';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export type BookDay = {
  id: string,
  date: string,
  hours: number,
  minutes: number,
  text: string,
  presence: Presence,
  presenceLocation: PresenceType
}

export namespace BookDay {
  export function getFormGroup(bookDay: BookDay): FormGroup {
    return new FormGroup({
      id: new FormControl<string>(bookDay.id),
      date: new FormControl<string>(bookDay.date),
      presence: new FormControl<Presence>(bookDay.presence),
      presenceLocation: new FormControl<PresenceType>(bookDay.presenceLocation),
      text: new FormControl<string>(bookDay.text, Validators.maxLength(5000)),
      hours: new FormControl<number>(bookDay.hours, {validators: [Validators.min(0), Validators.max(24)]}),
      minutes: new FormControl<number>(bookDay.minutes, {validators: [Validators.min(0), Validators.max(59)]}),
    });
  }
}
