"use client";

import { useEffect, useRef } from "react";
import { useLearningStore } from "@/lib/store";
import { getLearnedComponents, markComponentLearned } from "@/app/learn/actions";

export function LearningSyncProvider({ user }: { user: any }) {
  const setLearnedComponents = useLearningStore(state => state.setLearnedComponents);
  const learnedComponents = useLearningStore(state => state.learnedComponents);
  const isHydrated = useRef(false);

  useEffect(() => {
    if (user && !isHydrated.current) {
      isHydrated.current = true;
      getLearnedComponents().then(res => {
        if (res.success && res.data) {
          // Merge local and server progress
          const serverSet = new Set(res.data);
          const localSet = new Set(learnedComponents);
          const merged = Array.from(new Set([...serverSet, ...localSet]));
          
          if (merged.length !== localSet.size) {
            setLearnedComponents(merged);
            // Additionally, we should sync local ones to server that aren't on server
            const localOnly = merged.filter(c => !serverSet.has(c));
            localOnly.forEach(c => markComponentLearned(c));
          } else {
            setLearnedComponents(res.data);
          }
        }
      });
    }
  }, [user, setLearnedComponents, learnedComponents]);

  // Subscribe to markAsLearned
  useEffect(() => {
    if (user) {
      const unsub = useLearningStore.subscribe((state, prevState) => {
        const newComponents = state.learnedComponents.filter(c => !prevState.learnedComponents.includes(c));
        newComponents.forEach(c => markComponentLearned(c));
      });
      return unsub;
    }
  }, [user]);

  return null;
}
