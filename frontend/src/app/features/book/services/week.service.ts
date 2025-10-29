import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class WeekService {

  public getCurrentWeekNumber(): number {
    return this.getIsoWeekNumber(new Date(Date.now()));
  }

  private getIsoWeekNumber(date: Date): number {
    // Arbeite in UTC, damit Zeitzonen keine Rolle spielen
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // ISO: Montag = 1, Sonntag = 7
    const dayOfWeek = d.getUTCDay() || 7;
    // Verschiebe auf den Donnerstag in der selben Woche
    d.setUTCDate(d.getUTCDate() + 4 - dayOfWeek);
    // Jahresanfang des Jahres, zu dem der Donnerstag gehört
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Anzahl Tage zwischen Datum und Jahresanfang
    const diffInDays = Math.round((d.getTime() - yearStart.getTime()) / 86400000);
    // Woche berechnen (erste Woche beginnt mit dem ersten Donnerstag)
    return Math.ceil((diffInDays + 1) / 7);
  }

}
