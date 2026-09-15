import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LearnDashboardClient } from "@/components/learning/LearnDashboardClient";

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch quiz history
  const { data: quizData } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const quizHistory = quizData || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">학습 대시보드</h1>
        <p className="text-muted-foreground">CinemaFlow에서 학습한 shadcn/ui 컴포넌트 진도를 확인하고 퀴즈를 풀어보세요.</p>
      </div>

      <LearnDashboardClient quizHistory={quizHistory} />
    </div>
  );
}
