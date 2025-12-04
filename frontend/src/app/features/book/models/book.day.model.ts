import {Presence, PresenceType} from '@features/book/models/presence.type';

// Backend sends dates as ISO LocalDate strings (yyyy-MM-dd). Use string here
// to avoid implicit Date parsing mismatch; components may convert to Date if needed.
export type BookDay = {
  id: string,
  date: string,
  duration: number,
  presence: Presence,
  presenceLocation: PresenceType
}
