import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LearningState {
  isLearningMode: boolean;
  learnedComponents: string[];
  toggleLearningMode: () => void;
  markAsLearned: (id: string) => void;
  unmarkAsLearned: (id: string) => void;
  setLearnedComponents: (components: string[]) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      isLearningMode: false,
      learnedComponents: [],
      toggleLearningMode: () => set((state) => ({ isLearningMode: !state.isLearningMode })),
      markAsLearned: (id) =>
        set((state) => ({
          learnedComponents: state.learnedComponents.includes(id)
            ? state.learnedComponents
            : [...state.learnedComponents, id],
        })),
      unmarkAsLearned: (id) =>
        set((state) => ({
          learnedComponents: state.learnedComponents.filter((c) => c !== id),
        })),
      setLearnedComponents: (components) => set({ learnedComponents: components }),
    }),
    {
      name: "learning-storage",
      partialize: (state) => ({ 
        isLearningMode: state.isLearningMode, 
        learnedComponents: state.learnedComponents 
      }),
    }
  )
);
