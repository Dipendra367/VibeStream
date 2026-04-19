import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { usePlayerStore } from '../store/usePlayerStore';
import QueueItem from './QueueItem';

const Queue: React.FC = () => {
  const { queue, currentIndex, setCurrentIndex, removeFromQueue, reorderQueue } = usePlayerStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id);
      const newIndex = queue.findIndex((item) => item.id === over.id);
      reorderQueue(oldIndex, newIndex);
    }
  };

  if (queue.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
        <p className="text-sm">Queue is empty</p>
        <p className="text-xs mt-2 text-center">Search for a song or paste a link above to start listening.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-20 custom-scrollbar">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={queue.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {queue.map((item, index) => (
               <QueueItem
                 key={item.id}
                 item={item}
                 index={index}
                 isActive={index === currentIndex}
                 onPlay={() => setCurrentIndex(index)}
                 onRemove={() => removeFromQueue(item.id)}
               />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Queue;
