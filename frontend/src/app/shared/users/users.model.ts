import {Optional} from '@shared/datamapping/optional';

export type User = {
  id: string,
  forename: string,
  surname: string,
  email: string,
  password: string,
  authorities: Authority[],
  expired: boolean,
  locked: boolean,
  credentialsExpired: boolean,
  enabled: boolean,
  userType: UserType,
  assignedCompany: Optional<any>
}

export type UserBody = {
  id: string,
  forename: string,
  surname: string,
  userType: UserType
}

export type AdvancedUserBody = UserBody & {
  assignedCompany: Optional<any>,
  authorities: Authority[],
}

export type PasswordUserBody = AdvancedUserBody & {
  password: string
}

export enum UserType {
  TRAINEE = 'TRAINEE',
  TRAINER = 'TRAINER',
  COMPANY = 'COMPANY',
}

export enum Authority {
  TRAINEE = 'TRAINEE',
  TRAINER = 'TRAINER',
  COMPANY = 'COMPANY',
  ADMINISTRATOR = 'ADMINISTRATOR',
}
