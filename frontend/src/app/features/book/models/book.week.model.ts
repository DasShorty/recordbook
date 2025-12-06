import {BookDay} from '@features/book/models/book.day.model';

export type BookWeek = {
  id: string
  days: BookDay[],
  signedFromTrainer: string,
  calendarWeek: number,
  year: number
}
