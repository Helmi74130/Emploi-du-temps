import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import type { TimeSlot, Subject } from '../types';
import { Trash2, Edit2, Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface ScheduleGridProps {
  onEditSlot?: (slot: TimeSlot) => void;
  onAddSlot?: (day: number, timeIndex: number) => void;
}

export function ScheduleGrid({ onEditSlot, onAddSlot }: ScheduleGridProps) {
  const { subjects, timeSlots, config, updateTimeSlot, deleteTimeSlot } = useSchedule();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const [, day, timeIndex] = (over.id as string).split('-').map(Number);
      const slot = timeSlots.find(s => s.id === active.id);

      if (slot && !isNaN(day) && !isNaN(timeIndex)) {
        updateTimeSlot(slot.id, {
          day,
          startTime: config.timeSlots[timeIndex],
          endTime: calculateEndTime(config.timeSlots[timeIndex], config.slotDuration),
        });
      }
    }

    setActiveId(null);
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const getSlotsForCell = (day: number, timeIndex: number): TimeSlot[] => {
    return timeSlots.filter(
      slot => slot.day === day && slot.startTime === config.timeSlots[timeIndex]
    );
  };

  const getSubject = (subjectId: string | null): Subject | undefined => {
    return subjects.find(s => s.id === subjectId);
  };

  const activeSlot = timeSlots.find(s => s.id === activeId);
  const activeSubject = activeSlot ? getSubject(activeSlot.subjectId) : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white border border-blue-500 w-24">
                    Heures
                  </th>
                  {config.daysOfWeek.map((day, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-center text-sm font-semibold text-white border border-blue-500 min-w-[150px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.timeSlots.map((time, timeIndex) => (
                  <tr key={timeIndex} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50">
                      {time}
                    </td>
                    {config.daysOfWeek.map((_, dayIndex) => {
                      const slots = getSlotsForCell(dayIndex, timeIndex);
                      const cellId = `cell-${dayIndex}-${timeIndex}`;

                      return (
                        <DroppableCell
                          key={cellId}
                          id={cellId}
                          slots={slots}
                          subjects={subjects}
                          onEdit={onEditSlot}
                          onDelete={deleteTimeSlot}
                          onAdd={() => onAddSlot?.(dayIndex, timeIndex)}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeSlot && activeSubject && (
          <div
            className="px-3 py-2 rounded-lg shadow-lg cursor-move opacity-90"
            style={{ backgroundColor: activeSubject.color }}
          >
            <div className="text-white font-medium text-sm">{activeSubject.name}</div>
            {activeSlot.room && (
              <div className="text-white text-xs opacity-90">{activeSlot.room}</div>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

interface DroppableCellProps {
  id: string;
  slots: TimeSlot[];
  subjects: Subject[];
  onEdit?: (slot: TimeSlot) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

function DroppableCell({ id, slots, subjects, onEdit, onDelete, onAdd }: DroppableCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const getSubject = (subjectId: string | null): Subject | undefined => {
    return subjects.find(s => s.id === subjectId);
  };

  return (
    <td
      ref={setNodeRef}
      className={`border border-gray-200 p-1 min-h-[80px] relative group ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex flex-col gap-1 min-h-[80px]">
        {slots.length > 0 ? (
          slots.map((slot) => {
            const subject = getSubject(slot.subjectId);
            return subject ? (
              <DraggableSlot
                key={slot.id}
                slot={slot}
                subject={subject}
                onEdit={() => onEdit?.(slot)}
                onDelete={() => onDelete(slot.id)}
              />
            ) : null;
          })
        ) : (
          <button
            onClick={onAdd}
            className="w-full h-full min-h-[80px] flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded"
          >
            <Plus size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
        {slots.length > 0 && (
          <button
            onClick={onAdd}
            className="w-full py-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100"
          >
            <Plus size={14} />
            Ajouter
          </button>
        )}
      </div>
    </td>
  );
}

interface DraggableSlotProps {
  slot: TimeSlot;
  subject: Subject;
  onEdit: () => void;
  onDelete: () => void;
}

function DraggableSlot({ slot, subject, onEdit, onDelete }: DraggableSlotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: slot.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: subject.color }}
      {...listeners}
      {...attributes}
      className="px-3 py-2 rounded-lg cursor-move transition-all relative touch-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-white font-medium text-sm">{subject.name}</div>
      {slot.room && <div className="text-white text-xs opacity-90 mt-1">{slot.room}</div>}
      {slot.teacher && <div className="text-white text-xs opacity-90">{slot.teacher}</div>}

      {isHovered && !isDragging && (
        <div className="absolute top-1 right-1 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 bg-white rounded hover:bg-gray-100 transition-colors"
            title="Modifier"
          >
            <Edit2 size={14} className="text-gray-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 bg-white rounded hover:bg-red-100 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
}
