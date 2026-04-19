import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiMenu, FiTrash2, FiPlay } from 'react-icons/fi';
import type { QueueItem as QueueItemType } from '../store/usePlayerStore';

interface Props {
  item: QueueItemType;
  index: number;
  isActive: boolean;
  onPlay: () => void;
  onRemove: () => void;
}

const QueueItem: React.FC<Props> = ({ item, index, isActive, onPlay, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center p-3 rounded-xl transition-colors ${
        isActive 
          ? 'bg-blue-500/10 border border-blue-500/30' 
          : isDragging 
            ? 'bg-white/10 shadow-xl'
            : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab p-2 text-gray-500 hover:text-white transition-colors mr-2"
      >
        <FiMenu />
      </div>

      <div className="relative w-12 h-12 rounded object-cover cursor-pointer overflow-hidden mr-4 shadow-md bg-black shrink-0" onClick={onPlay}>
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        {isActive && (
          <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
            <FiPlay className="text-white drop-shadow-md" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 pr-4 cursor-pointer" onClick={onPlay}>
        <p className={`truncate font-medium text-sm ${isActive ? 'text-blue-400' : 'text-gray-200'}`}>
          {item.title}
        </p>
        <p className="truncate text-xs text-gray-500 mt-0.5">
          {item.channelTitle || 'YouTube'}
        </p>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-white/10 focus:opacity-100"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

export default QueueItem;
