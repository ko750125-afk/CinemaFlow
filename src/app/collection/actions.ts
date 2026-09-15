"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCollectionItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("collection_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/collection");
  return { success: true };
}

export async function updateCollectionItemStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("collection_items")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/collection");
  return { success: true };
}

export async function addToCollection(data: {
  tmdb_movie_id: string;
  movie_title: string;
  poster_path?: string;
  status: "watch-later" | "favorite";
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("collection_items")
    .upsert({
      user_id: user.id,
      tmdb_movie_id: data.tmdb_movie_id,
      movie_title: data.movie_title,
      poster_path: data.poster_path,
      status: data.status,
    }, { onConflict: "user_id,tmdb_movie_id,status" });

  if (error) return { error: error.message };

  revalidatePath("/collection");
  return { success: true };
}

