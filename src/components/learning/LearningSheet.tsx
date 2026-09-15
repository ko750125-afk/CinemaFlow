"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useLearningStore } from "@/lib/store";
import { learningMetadata, LearningMeta } from "@/lib/learning-meta";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function LearningSheet() {
  const [open, setOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<LearningMeta | null>(null);
  
  const learnedComponents = useLearningStore((state) => state.learnedComponents);
  const markAsLearned = useLearningStore((state) => state.markAsLearned);
  const unmarkAsLearned = useLearningStore((state) => state.unmarkAsLearned);

  useEffect(() => {
    const handleOpenSheet = (e: Event) => {
      const customEvent = e as CustomEvent<{ componentId: string }>;
      const componentId = customEvent.detail.componentId;
      const meta = learningMetadata[componentId];
      if (meta) {
        setActiveComponent(meta);
        setOpen(true);
      }
    };

    window.addEventListener("open-learning-sheet", handleOpenSheet);
    return () => {
      window.removeEventListener("open-learning-sheet", handleOpenSheet);
    };
  }, []);

  if (!activeComponent) return null;

  const isLearned = learnedComponents.includes(activeComponent.id);

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      markAsLearned(activeComponent.id);
    } else {
      unmarkAsLearned(activeComponent.id);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[90vw] sm:w-[600px] sm:max-w-[600px] overflow-y-auto p-6">
        <SheetHeader className="mb-6 pb-2 border-b">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                {activeComponent.name}
              </SheetTitle>
              <SheetDescription className="text-base mt-2">
                {activeComponent.description}
              </SheetDescription>
            </div>
            <a
              href={activeComponent.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Docs <ExternalLink size={14} />
            </a>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-2">
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">일반적인 사용 목적</h4>
            <p className="text-sm leading-relaxed">{activeComponent.purpose}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">현재 화면에서 사용된 이유</h4>
            <p className="text-sm leading-relaxed">{activeComponent.reasonUsed}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">함께 자주 사용하는 컴포넌트</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {activeComponent.relatedComponents.map((comp) => (
                <Badge key={comp} variant="secondary">{comp}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">짧은 사용 예제</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto text-muted-foreground whitespace-pre-wrap">
              <code>{activeComponent.exampleCode}</code>
            </pre>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">접근성 및 주의사항</h4>
            <p className="text-sm leading-relaxed">{activeComponent.accessibility}</p>
          </div>
          
          <Separator />

          <div className="flex items-center space-x-2 bg-muted/50 p-4 rounded-lg mt-8">
            <Checkbox 
              id="learned" 
              checked={isLearned} 
              onCheckedChange={handleCheckedChange}
            />
            <label
              htmlFor="learned"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
            >
              이 컴포넌트의 사용법을 이해했습니다
            </label>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
