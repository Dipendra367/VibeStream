import { create } from 'zustand';

export type QueueItem = {
  id: string; // unique dnd ID
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle?: string;
};

interface PlayerState {
  queue: QueueItem[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isLoop: 'none' | 'queue' | 'track';
  
  // Actions
  setQueue: (queue: QueueItem[]) => void;
  addToQueue: (item: Omit<QueueItem, 'id'>) => void;
  removeFromQueue: (id: string) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  
  setCurrentIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  
  setIsPlaying: (isPlaying: boolean) => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  (set) => ({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    isShuffle: false,
    isLoop: 'none',

    setQueue: (queue) => set({ queue }),
    
    addToQueue: (item) => set((state) => {
      const newItem: QueueItem = { ...item, id: crypto.randomUUID() };
      const newQueue = [...state.queue, newItem];
      if (state.queue.length === 0) {
        return { queue: newQueue, currentIndex: 0, isPlaying: true };
      }
      return { queue: newQueue };
    }),

    removeFromQueue: (id) => set((state) => {
      const indexToRemove = state.queue.findIndex(q => q.id === id);
      const newQueue = state.queue.filter(q => q.id !== id);
      
      let newIndex = state.currentIndex;
      if (indexToRemove < state.currentIndex) {
        newIndex -= 1;
      } else if (indexToRemove === state.currentIndex) {
        if (newQueue.length === 0) {
           newIndex = -1;
        } else if (newIndex >= newQueue.length) {
           newIndex = 0;
        }
      }
      return { queue: newQueue, currentIndex: newIndex };
    }),

    reorderQueue: (startIndex, endIndex) => set((state) => {
      const result = Array.from(state.queue);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      let newIndex = state.currentIndex;
      if (state.currentIndex === startIndex) {
          newIndex = endIndex;
      } else if (startIndex < state.currentIndex && endIndex >= state.currentIndex) {
          newIndex -= 1;
      } else if (startIndex > state.currentIndex && endIndex <= state.currentIndex) {
          newIndex += 1;
      }
      
      return { queue: result, currentIndex: newIndex };
    }),

    setCurrentIndex: (index) => set({ currentIndex: index, isPlaying: true }),

    playNext: () => set((state) => {
      if (state.queue.length === 0) return {};
      let nextIndex = state.currentIndex + 1;

      if (state.isShuffle) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else if (nextIndex >= state.queue.length) {
        if (state.isLoop === 'queue') {
          nextIndex = 0;
        } else {
          return { isPlaying: false, currentIndex: 0 };
        }
      }
      return { currentIndex: nextIndex, isPlaying: true };
    }),

    playPrevious: () => set((state) => {
      if (state.queue.length === 0) return {};
      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
         prevIndex = state.queue.length - 1;
      }
      return { currentIndex: prevIndex, isPlaying: true };
    }),

    setIsPlaying: (isPlaying) => set({ isPlaying }),

    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

    toggleLoop: () => set((state) => {
      const loopModes: PlayerState['isLoop'][] = ['none', 'queue', 'track'];
      const nextIndex = (loopModes.indexOf(state.isLoop) + 1) % loopModes.length;
      return { isLoop: loopModes[nextIndex] };
    }),
  })
);
