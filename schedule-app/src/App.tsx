import { useState } from 'react';
import { Calendar, Book, Settings, Download, Upload } from 'lucide-react';
import { ScheduleGrid } from './components/ScheduleGrid';
import { SubjectsPanel } from './components/SubjectsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { SlotModal } from './components/SlotModal';
import type { TimeSlot } from './types';
import { useSchedule } from './hooks/useSchedule';

type Tab = 'schedule' | 'subjects' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [newSlotDay, setNewSlotDay] = useState<number | undefined>();
  const [newSlotTimeIndex, setNewSlotTimeIndex] = useState<number | undefined>();
  const { subjects, timeSlots, config } = useSchedule();

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setNewSlotDay(undefined);
    setNewSlotTimeIndex(undefined);
    setIsSlotModalOpen(true);
  };

  const handleAddSlot = (day: number, timeIndex: number) => {
    setEditingSlot(null);
    setNewSlotDay(day);
    setNewSlotTimeIndex(timeIndex);
    setIsSlotModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSlotModalOpen(false);
    setEditingSlot(null);
    setNewSlotDay(undefined);
    setNewSlotTimeIndex(undefined);
  };

  const handleExport = () => {
    const data = {
      subjects,
      timeSlots,
      config,
      version: '1.0',
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emploi-du-temps-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // Sauvegarder dans le localStorage
            localStorage.setItem('schedule_subjects', JSON.stringify(data.subjects));
            localStorage.setItem('schedule_timeslots', JSON.stringify(data.timeSlots));
            localStorage.setItem('schedule_config', JSON.stringify(data.config));
            // Recharger la page pour appliquer les changements
            window.location.reload();
          } catch (error) {
            alert('Erreur lors de l\'importation du fichier');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Mon Emploi du Temps</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Exporter"
              >
                <Download size={18} />
                Exporter
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                title="Importer"
              >
                <Upload size={18} />
                Importer
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar size={20} />
              Emploi du temps
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === 'subjects'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Book size={20} />
              Matières
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings size={20} />
              Paramètres
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'schedule' && (
          <div>
            <div className="mb-4 space-y-2">
              <p className="text-gray-700 font-medium">
                Comment utiliser l'emploi du temps :
              </p>
              <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                <li>Glissez-déposez les cours pour les déplacer</li>
                <li>Cliquez sur une case vide ou sur "Ajouter" pour ajouter un cours</li>
                <li>Vous pouvez avoir plusieurs cours dans la même tranche horaire</li>
                <li>Survolez un cours pour voir les options de modification et suppression</li>
              </ul>
            </div>
            <ScheduleGrid onEditSlot={handleEditSlot} onAddSlot={handleAddSlot} />
          </div>
        )}

        {activeTab === 'subjects' && <SubjectsPanel />}

        {activeTab === 'settings' && <SettingsPanel />}
      </main>

      <SlotModal
        isOpen={isSlotModalOpen}
        onClose={handleCloseModal}
        slot={editingSlot}
        initialDay={newSlotDay}
        initialTimeIndex={newSlotTimeIndex}
      />

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          Emploi du temps moderne - Toutes vos données sont stockées localement dans votre navigateur
        </div>
      </footer>
    </div>
  );
}

export default App;
