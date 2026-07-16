import {Brand} from '@shared/data/brand';

export type UserId = Brand<string, 'UserId'>

export type UserBase = {
  forename: string,
  surname: string,
  email: string,
  userType: UserType,
  authority: Authority,
}

export type User = UserBase & {
  id: UserId,
}

export type CreateUser = UserBase & {
  password: string,
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
