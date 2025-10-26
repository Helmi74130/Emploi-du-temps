import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#78716c', '#6b7280', '#475569',
];

export function SubjectsPanel() {
  const { subjects, updateSubject, deleteSubject, addSubject } = useSchedule();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const handleEdit = (id: string, name: string, color: string) => {
    setEditingId(id);
    setEditName(name);
    setEditColor(color);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateSubject(editingId, { name: editName.trim(), color: editColor });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  };

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim());
      setNewSubjectName('');
    }
  };

  const handleColorChange = (id: string, color: string) => {
    updateSubject(id, { color });
    setShowColorPicker(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Matières</h2>

      <div className="space-y-3 mb-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex items-center gap-2">
            {editingId === subject.id ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(showColorPicker === subject.id ? null : subject.id)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: editColor }}
                  />
                  {showColorPicker === subject.id && (
                    <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
                      <div className="grid grid-cols-5 gap-2 w-[200px]">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setEditColor(color);
                              setShowColorPicker(null);
                            }}
                            className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-colors"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  onClick={handleSaveEdit}
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
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(showColorPicker === subject.id ? null : subject.id)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: subject.color }}
                  />
                  {showColorPicker === subject.id && (
                    <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
                      <div className="grid grid-cols-5 gap-2 w-[200px]">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleColorChange(subject.id, color)}
                            className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-colors"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="flex-1 text-gray-900 font-medium">{subject.name}</span>
                <button
                  onClick={() => handleEdit(subject.id, subject.name, subject.color)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer la matière "${subject.name}" et tous les cours associés ?`)) {
                      deleteSubject(subject.id);
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
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Nouvelle matière..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddSubject();
          }}
        />
        <button
          onClick={handleAddSubject}
          disabled={!newSubjectName.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>
    </div>
  );
}
