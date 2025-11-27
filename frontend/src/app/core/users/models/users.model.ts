export type UserBody = {
  id: string,
  forename: string,
  surname: string,
  userType: UserType
}

export type AdvancedUser = UserBody & {
  authorities: Authority[],
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
