import {BookDayId} from '@features/book/models/book.day.model';
import {Presence, PresenceType} from '@features/book/models/presence.type';

export type BookDayFormValue = {
  id: BookDayId;
  date: string;
  presence: Presence | null;
  presenceLocation: PresenceType | null;
  hours: number;
  minutes: number;
};

export type BookWeekUpdatePayload = {
  weekId: string;
  bookId: string;
  text: string;
  days: BookDayFormValue[];
};
