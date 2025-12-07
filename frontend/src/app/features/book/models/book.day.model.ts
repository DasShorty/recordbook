import {Presence, PresenceType} from '@features/book/models/presence.type';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export type BookDay = {
  id: string,
  date: string,
  duration: number,
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
      duration: new FormControl<number>(bookDay.duration, {validators: [Validators.min(0), Validators.max(24)]}),
    });
  }
}
