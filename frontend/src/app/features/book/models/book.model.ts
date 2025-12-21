import {User} from '@core/users/models/users.model';
import {BookWeek} from '@features/book/models/book.week.model';

export type BookId = Brand<string, "BookId">

export type Book = {
  id: BookId,
  trainee: User,
  trainers: User[],
  weeks: BookWeek[]
}
