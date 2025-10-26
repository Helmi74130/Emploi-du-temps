export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface TimeSlot {
  id: string;
  subjectId: string | null;
  day: number; // 0 = Lundi, 1 = Mardi, etc.
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  room?: string;
  teacher?: string;
  notes?: string;
}

export interface ScheduleConfig {
  daysOfWeek: string[];
  timeSlots: string[]; // Liste des heures de début (ex: ["08:00", "09:00", "10:00"])
  slotDuration: number; // Durée en minutes
}
