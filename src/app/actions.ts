"use server";

import { searchMovies } from "@/lib/tmdb";

export async function searchMoviesAction(query: string) {
  if (!query) return [];
  const { results } = await searchMovies(query);
  return results.slice(0, 10);
}
