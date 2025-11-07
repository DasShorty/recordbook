import {Qualification} from '@features/job/models/qualification.model';

export type Job = {
  id: string,
  name: string,
  description: string,
  qualifications: Qualification[]
}

export type UpdateJob = {
  id: string,
  name: string,
  description: string,
  qualifications: string[]
}

export type JobOption = {
  id: string,
  name: string
}
