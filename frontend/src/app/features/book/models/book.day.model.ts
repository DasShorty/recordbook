import {Qualification} from '@features/job/models/qualification.model';

export type BookDay = {
  id: string,
  date: Date,
  duration: number,
  presence: unknown,
  presenceLocation: unknown,
  qualifications: Qualification[]
}
