import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export function SettingsPanel() {
  const { config, addDay, removeDay, updateDay, addTimeSlotToConfig, removeTimeSlotFromConfig } = useSchedule();
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editDayName, setEditDayName] = useState('');

  const handleAddDay = () => {
    if (newDay.trim()) {
      addDay(newDay.trim());
      setNewDay('');
    }
  };

  const handleAddTime = () => {
    if (newTime.trim()) {
      addTimeSlotToConfig(newTime.trim());
      setNewTime('');
    }
  };

  const handleEditDay = (index: number) => {
    setEditingDayIndex(index);
    setEditDayName(config.daysOfWeek[index]);
  };

  const handleSaveDay = () => {
    if (editingDayIndex !== null && editDayName.trim()) {
      updateDay(editingDayIndex, editDayName.trim());
      setEditingDayIndex(null);
      setEditDayName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingDayIndex(null);
    setEditDayName('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Jours de la semaine</h2>
        <div className="space-y-2 mb-3">
          {config.daysOfWeek.map((day, index) => (
            <div key={index} className="flex items-center gap-2">
              {editingDayIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editDayName}
                    onChange={(e) => setEditDayName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveDay();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <button
                    onClick={handleSaveDay}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-gray-900">{day}</span>
                  <button
                    onClick={() => handleEditDay(index)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer le jour "${day}" et tous les cours associés ?`)) {
                        removeDay(index);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            placeholder="Nouveau jour..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddDay();
            }}
          />
          <button
            onClick={handleAddDay}
            disabled={!newDay.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Créneaux horaires</h2>
        <div className="space-y-2 mb-3">
          {config.timeSlots.map((time, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 text-gray-900 font-mono">{time}</span>
              <button
                onClick={() => {
                  if (confirm(`Supprimer le créneau "${time}" ?`)) {
                    removeTimeSlotFromConfig(index);
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddTime}
            disabled={!newTime.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
