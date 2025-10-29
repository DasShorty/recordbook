import {Qualification} from '@features/job/models/qualification.model';

export type Job = {
  id: string,
  name: string,
  description: string,
  qualifications: Qualification[]
}
