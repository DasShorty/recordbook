import {AdvancedUser} from '@core/users/models/users.model';
import {BookWeek} from '@features/book/models/book.week.model';
import {Job} from '@features/job/models/job.model';

export type Book = {
  id: string,
  trainee: AdvancedUser,
  trainers: AdvancedUser[],
  qualifiedJob: Job,
  weeks: BookWeek[]
}
