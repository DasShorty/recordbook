import {Brand} from '@shared/data/brand';

export type UserId = Brand<string, "UserId">

export type User = CreateUser & {
  id: UserId,
}

export type CreateUser = {
  forename: string,
  surname: string,
  userType: UserType,
  authority: Authority,
}

export enum UserType {
  TRAINEE = 'TRAINEE',
  TRAINER = 'TRAINER',
}

export enum Authority {
  TRAINEE = 'TRAINEE',
  TRAINER = 'TRAINER',
  ADMINISTRATOR = 'ADMINISTRATOR',
}
