import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class WeekService {

  public getCurrentWeekNumber(): number {
    return this.getIsoWeekNumber(new Date(Date.now()));
  }

  private getIsoWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayOfWeek = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayOfWeek);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const diffInDays = Math.round((d.getTime() - yearStart.getTime()) / 86400000);
    return Math.ceil((diffInDays + 1) / 7);
  }

}
