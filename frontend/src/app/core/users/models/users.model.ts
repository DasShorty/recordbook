import {Optional} from '@shared/datamapping/optional';
import {Company} from '@features/company/models/company.model';

export type UserBody = {
  id: string,
  forename: string,
  surname: string,
  userType: UserType
}

export type AdvancedUser = UserBody & {
  assignedCompany: Optional<Company>,
  authorities: Authority[],
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
