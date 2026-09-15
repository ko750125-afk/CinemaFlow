"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveWatchRecord(data: {
  tmdb_movie_id: string;
  movie_title: string;
  poster_path?: string;
  rating: number;
  viewed_at?: Date;
  place?: string;
  one_liner?: string;
  review?: string;
  is_spoiler: boolean;
  visibility: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const { error } = await supabase.from("watch_records").insert({
    user_id: user.id,
    ...data,
  });

  if (error) {
    console.error("Watch record save error:", error);
    return { error: "기록 저장 중 오류가 발생했습니다." };
  }

  // Collection 상태도 자동으로 watched로 업데이트/삽입
  await supabase.from("collection_items").upsert({
    user_id: user.id,
    tmdb_movie_id: data.tmdb_movie_id,
    movie_title: data.movie_title,
    poster_path: data.poster_path,
    status: 'watched'
  }, { onConflict: 'user_id,tmdb_movie_id,status' });

  return { success: true };
}
