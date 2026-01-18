import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BookWeekNavigationService {
  private readonly MIN_CALENDAR_WEEK = 1;
  private readonly MAX_CALENDAR_WEEK = 52;

  getNextWeek(
    calendarWeek: number,
    year: number
  ): { week: number; year: number } {
    if (this.isLastWeek(calendarWeek)) {
      return {week: this.MIN_CALENDAR_WEEK, year: year + 1};
    }
    return {week: calendarWeek + 1, year};
  }

  getPreviousWeek(
    calendarWeek: number,
    year: number
  ): { week: number; year: number } {
    if (this.isFirstWeek(calendarWeek)) {
      return {week: this.MAX_CALENDAR_WEEK, year: year - 1};
    }
    return {week: calendarWeek - 1, year};
  }

  isFirstWeek(calendarWeek: number): boolean {
    return calendarWeek === this.MIN_CALENDAR_WEEK;
  }

  isLastWeek(calendarWeek: number): boolean {
    return calendarWeek === this.MAX_CALENDAR_WEEK;
  }
}
