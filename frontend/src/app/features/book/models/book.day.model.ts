import {Presence, PresenceType} from '@features/book/models/presence.type';

export type BookDay = {
  id: string,
  date: Date,
  duration: number,
  presence: Presence,
  presenceLocation: PresenceType
}
