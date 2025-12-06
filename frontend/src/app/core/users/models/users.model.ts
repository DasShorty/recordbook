export type User = CreateUser & {
  id: string,
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
