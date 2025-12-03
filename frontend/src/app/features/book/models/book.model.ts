import {AdvancedUser} from '@core/users/models/users.model';
import {BookWeek} from '@features/book/models/book.week.model';

export type Book = {
  id: string,
  trainee: AdvancedUser,
  trainers: AdvancedUser[],
  weeks: BookWeek[]
}
