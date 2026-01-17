import {User} from '@core/users/models/users.model';
import {BookWeek} from '@features/book/models/book.week.model';
import {Brand} from '@shared/data/brand';

export type BookId = Brand<string, "BookId">

export type Book = {
  id: BookId,
  trainee: User,
  trainer: User,
  weeks: BookWeek[]
}
