"use client";

import { useLearningStore } from "@/lib/store";
import { learningMetadata } from "@/lib/learning-meta";
import { BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LearningWrapperProps {
  children: React.ReactNode;
  componentId: string;
  className?: string;
}

export function LearningWrapper({ children, componentId, className = "" }: LearningWrapperProps) {
  const isLearningMode = useLearningStore((state) => state.isLearningMode);
  const markAsLearned = useLearningStore((state) => state.markAsLearned);

  if (!isLearningMode) return <>{children}</>;

  const meta = learningMetadata[componentId];
  if (!meta) return <>{children}</>;

  const openLearningSheet = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would open the LearningSheet and pass the componentId.
    // For now, let's just mark it as learned for demonstration.
    markAsLearned(componentId);
    
    // Dispatch a custom event to open the sheet
    const event = new CustomEvent("open-learning-sheet", { detail: { componentId } });
    window.dispatchEvent(event);
  };

  return (
    <div className={`relative group inline-block ${className}`}>
      <div className="absolute -inset-0.5 border border-transparent group-hover:border-red-500 rounded pointer-events-none z-10 transition-colors" />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute -top-3 -right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={openLearningSheet}
              className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
              aria-label={`${meta.name} 상세 설명 보기`}
            >
              <BookOpen size={14} />
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-bold">{meta.name}</p>
          <p className="text-xs text-muted-foreground">{meta.description}</p>
        </TooltipContent>
      </Tooltip>
      
      {children}
    </div>
  );
}
