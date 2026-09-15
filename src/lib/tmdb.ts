import { Movie } from "./mock-data";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getHeaders() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    console.warn("TMDB_ACCESS_TOKEN is not defined in environment variables");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append("language", "ko-KR");
  url.searchParams.append("region", "KR");
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // 캐시 1시간
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function mapToMovie(item: any): Movie {
  return {
    id: item.id.toString(),
    title: item.title || item.name,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : 0,
    genre: item.genre_ids ? item.genre_ids.map((id: number) => getGenreName(id)) : [],
    duration: "120분", // 목록에서는 알 수 없으므로 기본값
    rating: item.vote_average || 0,
    ageRating: "미상", 
    director: "미상",
    cast: [],
    summary: item.overview || "설명이 제공되지 않습니다.",
    description: item.overview || "설명이 제공되지 않습니다.",
    posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE}/w500${item.poster_path}` : "https://via.placeholder.com/600x900?text=No+Poster",
    backdropUrl: item.backdrop_path ? `${TMDB_IMAGE_BASE}/original${item.backdrop_path}` : "https://via.placeholder.com/1920x1080?text=No+Backdrop",
  };
}

// 간단한 장르 매핑 (TMDB 기본 장르 ID)
const GENRE_MAP: Record<number, string> = {
  28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디", 80: "범죄", 99: "다큐멘터리", 
  18: "드라마", 10751: "가족", 14: "판타지", 36: "역사", 27: "공포", 10402: "음악", 
  9648: "미스터리", 10749: "로맨스", 878: "SF", 10770: "TV 영화", 53: "스릴러", 10752: "전쟁", 37: "서부"
};

export function getGenreName(id: number): string {
  return GENRE_MAP[id] || "기타";
}

export async function getPopularMovies(): Promise<Movie[]> {
  try {
    const data = await fetchTMDB("/movie/popular");
    return data.results.map(mapToMovie);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTrendingMovies(): Promise<Movie[]> {
  try {
    const data = await fetchTMDB("/trending/movie/week");
    return data.results.map(mapToMovie);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  try {
    const data = await fetchTMDB("/movie/upcoming");
    return data.results.map((item: any) => ({ ...mapToMovie(item), isUpcoming: true }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMovieDetail(id: string): Promise<Movie | null> {
  try {
    const data = await fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos" });
    
    // 감독 찾기
    const directorObj = data.credits?.crew?.find((c: any) => c.job === "Director");
    const director = directorObj ? directorObj.name : "미상";
    
    // 배우 찾기 (상위 5명)
    const cast = data.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [];

    // 예고편 찾기
    const videoObj = data.videos?.results?.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
    const videoKey = videoObj ? videoObj.key : undefined;

    return {
      id: data.id.toString(),
      title: data.title || data.name,
      year: data.release_date ? parseInt(data.release_date.substring(0, 4)) : 0,
      genre: data.genres ? data.genres.map((g: any) => g.name) : [],
      duration: data.runtime ? `${data.runtime}분` : "미상",
      rating: data.vote_average || 0,
      ageRating: "미상", // TMDB에서 release_dates를 가져와야 알 수 있음
      director,
      cast,
      summary: data.overview || "설명이 제공되지 않습니다.",
      description: data.overview || "설명이 제공되지 않습니다.",
      posterUrl: data.poster_path ? `${TMDB_IMAGE_BASE}/w500${data.poster_path}` : "https://via.placeholder.com/600x900?text=No+Poster",
      backdropUrl: data.backdrop_path ? `${TMDB_IMAGE_BASE}/original${data.backdrop_path}` : "https://via.placeholder.com/1920x1080?text=No+Backdrop",
      videoKey,
    };
  } catch (error) {
    console.error(`Error fetching movie detail for ID ${id}:`, error);
    return null;
  }
}

export async function searchMovies(query: string, page: number = 1): Promise<{ results: Movie[], totalPages: number }> {
  try {
    const data = await fetchTMDB("/search/movie", { query, page: page.toString() });
    return {
      results: data.results.map(mapToMovie),
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error(error);
    return { results: [], totalPages: 0 };
  }
}

export async function discoverMovies(params: Record<string, string>): Promise<{ results: Movie[], totalPages: number }> {
  try {
    const data = await fetchTMDB("/discover/movie", params);
    return {
      results: data.results.map(mapToMovie),
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error(error);
    return { results: [], totalPages: 0 };
  }
}

export async function getRecommendations(genreIds: number[]): Promise<Movie[]> {
  try {
    const params: Record<string, string> = {
      sort_by: "popularity.desc",
      page: "1",
    };
    
    if (genreIds.length > 0) {
      params.with_genres = genreIds.join(",");
    }

    const { results } = await discoverMovies(params);
    return results;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}
