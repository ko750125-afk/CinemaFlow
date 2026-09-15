import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Film, Star, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InsightsClient } from "@/components/movie/InsightsClient";
import { getMovieDetail } from "@/lib/tmdb";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch watch records
  const { data: records, error } = await supabase
    .from("watch_records")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching watch records:", error);
  }

  const userRecords = records || [];

  // Calculate basic stats
  const totalRecords = userRecords.length;
  const avgRating = totalRecords > 0 
    ? userRecords.reduce((acc, curr) => acc + Number(curr.rating), 0) / totalRecords 
    : 0;

  // Since watch_records doesn't store genre, we fetch details from TMDB to find genre distribution
  // (In a real app with many records, this should be cached or stored in DB)
  const genreCounts: Record<string, number> = {};
  const monthCounts: Record<string, number> = {};
  
  if (totalRecords > 0) {
    // Process month counts
    userRecords.forEach(r => {
      if (r.viewed_at) {
        // e.g. "2024-03"
        const month = r.viewed_at.substring(0, 7);
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });

    // Process genre counts (limit to 10 latest records to avoid TMDB rate limit)
    const recentRecords = [...userRecords].reverse().slice(0, 10);
    const movieDetails = await Promise.all(
      recentRecords.map(r => getMovieDetail(r.tmdb_movie_id).catch(() => null))
    );

    movieDetails.forEach(detail => {
      if (detail && detail.genre) {
        detail.genre.forEach(g => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      }
    });
  }

  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "데이터 부족";

  // Prepare chart data
  const monthData = Object.entries(monthCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ month, count }));

  const genreData = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({ genre, count }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">내 취향 분석</h1>
        <p className="text-muted-foreground">감상 기록을 바탕으로 영화 취향을 분석해드립니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 감상 영화</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}편</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}점</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">가장 선호하는 장르</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topGenre}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InsightsClient monthData={monthData} genreData={genreData} />
      </div>
    </div>
  );
}
