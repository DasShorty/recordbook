import {BookDay} from '@features/book/models/book.day.model';

export type BookWeekId = Brand<string, "BookWeekId">

export type BookWeek = {
  id: BookWeekId
  text: string,
  days: BookDay[],
  signedFromTrainer: string,
  calendarWeek: number,
  year: number,
  locked: boolean
}
