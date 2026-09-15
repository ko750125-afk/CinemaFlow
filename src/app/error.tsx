"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">오류가 발생했습니다</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        예상치 못한 오류가 발생하여 페이지를 불러올 수 없습니다. 
        계속해서 문제가 발생하면 관리자에게 문의해주세요.
      </p>
      <Button onClick={() => reset()} variant="default">
        다시 시도하기
      </Button>
    </div>
  );
}
