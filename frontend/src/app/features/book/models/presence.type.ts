export enum Presence {
  PRESENT = "PRESENT",
  VACATION = "VACATION",
  COMPENSATORY_TIME = "COMPENSATORY_TIME",
  ABSENCE = "ABSENCE",
}

export enum PresenceType {
  WORK = "WORK",
  SCHOOL = "SCHOOL",
  GUIDANCE = "GUIDANCE"
}

export class PresenceDisplay {

  static getPresenceDisplay(presence: Presence): string {
    switch (presence) {
      case Presence.ABSENCE:
        return "Abwesend";
      case Presence.COMPENSATORY_TIME:
        return "Zeitausgleich";
      case Presence.PRESENT:
        return "anwesend";
      case Presence.VACATION:
        return "Urlaub"
    }
  }

  static getPresenceType(presenceType: PresenceType): string {
    switch (presenceType) {
      case PresenceType.GUIDANCE:
        return "Unterweisung";
      case PresenceType.WORK:
        return "Betrieb";
      case PresenceType.SCHOOL:
        return "Schule";
    }
  }

}
