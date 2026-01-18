export interface PresenceStatistics {
  presentDays: number;
  vacationDays: number;
  absenceDays: number;
  compensatoryTimeDays: number;
}

export interface LocationStatistics {
  workDays: number;
  schoolDays: number;
  guidanceDays: number;
}

export interface WeeklyHours {
  calendarWeek: number;
  year: number;
  totalHours: number;
  totalMinutes: number;
}

export interface TraineeStatistics {
  totalWeeks: number;
  completedWeeks: number;
  signedWeeks: number;
  pendingSignatureWeeks: number;
  totalHours: number;
  totalMinutes: number;
  presenceStatistics: PresenceStatistics;
  locationStatistics: LocationStatistics;
  weeklyHours: WeeklyHours[];
}

export interface TrainerStatistics {
  assignedTrainees: number;
  pendingSignatureWeeks: number;
  signedWeeks: number;
}

export interface AdminStatistics {
  totalUsers: number;
  totalTrainees: number;
  totalTrainers: number;
  totalBooks: number;
  totalWeeks: number;
  completedWeeks: number;
}
