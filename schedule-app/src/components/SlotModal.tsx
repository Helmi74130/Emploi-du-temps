import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useSchedule } from '../hooks/useSchedule';
import type { TimeSlot } from '../types';

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot?: TimeSlot | null;
  initialDay?: number;
  initialTimeIndex?: number;
}

export function SlotModal({ isOpen, onClose, slot, initialDay, initialTimeIndex }: SlotModalProps) {
  const { subjects, config, addTimeSlot, updateTimeSlot, addSubject } = useSchedule();
  const [formData, setFormData] = useState({
    subjectId: '',
    day: initialDay ?? 0,
    startTime: initialTimeIndex !== undefined ? config.timeSlots[initialTimeIndex] : config.timeSlots[0],
    endTime: '',
    room: '',
    teacher: '',
    notes: '',
  });

  const [newSubjectName, setNewSubjectName] = useState('');
  const [showNewSubject, setShowNewSubject] = useState(false);

  useEffect(() => {
    if (slot) {
      setFormData({
        subjectId: slot.subjectId || '',
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        room: slot.room || '',
        teacher: slot.teacher || '',
        notes: slot.notes || '',
      });
    } else if (initialDay !== undefined && initialTimeIndex !== undefined) {
      const startTime = config.timeSlots[initialTimeIndex];
      setFormData({
        subjectId: '',
        day: initialDay,
        startTime,
        endTime: calculateEndTime(startTime, config.slotDuration),
        room: '',
        teacher: '',
        notes: '',
      });
    }
  }, [slot, initialDay, initialTimeIndex, config]);

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (slot) {
      updateTimeSlot(slot.id, formData);
    } else {
      addTimeSlot(formData);
    }

    onClose();
  };

  const handleAddNewSubject = () => {
    if (newSubjectName.trim()) {
      const newSubject = addSubject(newSubjectName.trim());
      setFormData({ ...formData, subjectId: newSubject.id });
      setNewSubjectName('');
      setShowNewSubject(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={slot ? 'Modifier le cours' : 'Ajouter un cours'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matière *
          </label>
          {!showNewSubject ? (
            <div className="flex gap-2">
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner une matière</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewSubject(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouvelle
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Nom de la matière"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddNewSubject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowNewSubject(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jour *
            </label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {config.daysOfWeek.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure de début *
            </label>
            <select
              value={formData.startTime}
              onChange={(e) => {
                const startTime = e.target.value;
                setFormData({
                  ...formData,
                  startTime,
                  endTime: calculateEndTime(startTime, config.slotDuration),
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {config.timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure de fin *
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salle
          </label>
          <input
            type="text"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="ex: A201"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professeur
          </label>
          <input
            type="text"
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            placeholder="ex: M. Dupont"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notes additionnelles..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {slot ? 'Modifier' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
