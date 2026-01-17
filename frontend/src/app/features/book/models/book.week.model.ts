import {BookDay} from '@features/book/models/book.day.model';
import {User} from '@core/users/models/users.model';
import {Brand} from '@shared/data/brand';

export type BookWeekId = Brand<string, "BookWeekId">

export type BookWeek = {
  id: BookWeekId
  text: string,
  days: BookDay[],
  signedFromTrainer: User | null,
  calendarWeek: number,
  year: number,
  locked: boolean
}
