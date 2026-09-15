"use server";

import { createClient } from "@/lib/supabase/server";

export async function markComponentLearned(componentKey: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not logged in" };

  const { error } = await supabase
    .from("learning_progress")
    .upsert({
      user_id: user.id,
      component_key: componentKey,
      is_learned: true,
    }, { onConflict: "user_id,component_key" });

  if (error) {
    console.error("markComponentLearned Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getLearnedComponents() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, data: [] };

  const { data, error } = await supabase
    .from("learning_progress")
    .select("component_key")
    .eq("user_id", user.id)
    .eq("is_learned", true);

  if (error) {
    console.error("getLearnedComponents Error:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data.map(item => item.component_key) };
}

export async function saveQuizAttempt(score: number, totalQuestions: number, quizType: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not logged in" };

  const { error } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      score,
      total_questions: totalQuestions,
      quiz_type: quizType,
    });

  if (error) {
    console.error("saveQuizAttempt Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
