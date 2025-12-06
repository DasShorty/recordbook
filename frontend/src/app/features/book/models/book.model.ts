import {User} from '@core/users/models/users.model';
import {BookWeek} from '@features/book/models/book.week.model';

export type Book = {
  id: string,
  trainee: User,
  trainers: User[],
  weeks: BookWeek[]
}
