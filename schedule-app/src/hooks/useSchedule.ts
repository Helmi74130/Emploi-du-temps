import { useLocalStorage } from './useLocalStorage';
import type { Subject, TimeSlot, ScheduleConfig } from '../types';

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

const DEFAULT_CONFIG: ScheduleConfig = {
  daysOfWeek: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
  timeSlots: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  slotDuration: 60,
};

export function useSchedule() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('schedule_subjects', []);
  const [timeSlots, setTimeSlots] = useLocalStorage<TimeSlot[]>('schedule_timeslots', []);
  const [config, setConfig] = useLocalStorage<ScheduleConfig>('schedule_config', DEFAULT_CONFIG);

  // Fonctions pour gérer les matières
  const addSubject = (name: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      color: DEFAULT_COLORS[subjects.length % DEFAULT_COLORS.length],
    };
    setSubjects([...subjects, newSubject]);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    // Supprimer aussi les créneaux associés
    setTimeSlots(timeSlots.filter(ts => ts.subjectId !== id));
  };

  // Fonctions pour gérer les créneaux
  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    const newSlot: TimeSlot = {
      id: crypto.randomUUID(),
      ...slot,
    };
    setTimeSlots([...timeSlots, newSlot]);
    return newSlot;
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map(ts => ts.id === id ? { ...ts, ...updates } : ts));
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(ts => ts.id !== id));
  };

  // Fonctions pour gérer la configuration
  const updateConfig = (updates: Partial<ScheduleConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const addDay = (dayName: string) => {
    setConfig({
      ...config,
      daysOfWeek: [...config.daysOfWeek, dayName],
    });
  };

  const removeDay = (index: number) => {
    const newDays = config.daysOfWeek.filter((_, i) => i !== index);
    setConfig({ ...config, daysOfWeek: newDays });
    // Supprimer les créneaux du jour supprimé
    setTimeSlots(timeSlots.filter(ts => ts.day !== index));
  };

  const updateDay = (index: number, newName: string) => {
    const newDays = [...config.daysOfWeek];
    newDays[index] = newName;
    setConfig({ ...config, daysOfWeek: newDays });
  };

  const addTimeSlotToConfig = (time: string) => {
    const newTimeSlots = [...config.timeSlots, time].sort();
    setConfig({ ...config, timeSlots: newTimeSlots });
  };

  const removeTimeSlotFromConfig = (index: number) => {
    const newTimeSlots = config.timeSlots.filter((_, i) => i !== index);
    setConfig({ ...config, timeSlots: newTimeSlots });
  };

  return {
    subjects,
    timeSlots,
    config,
    addSubject,
    updateSubject,
    deleteSubject,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    updateConfig,
    addDay,
    removeDay,
    updateDay,
    addTimeSlotToConfig,
    removeTimeSlotFromConfig,
  };
}
