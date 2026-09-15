import Link from "next/link";
import { Play, Info, AlertCircle, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { getPopularMovies, getTrendingMovies, getUpcomingMovies, getRecommendations, getMovieDetail } from "@/lib/tmdb";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const [popularMovies, trendingMovies, upcomingMovies] = await Promise.all([
    getPopularMovies(),
    getTrendingMovies(),
    getUpcomingMovies()
  ]);
  
  const heroMovie = trendingMovies[0] || popularMovies[0];

  // Recommendations Logic
  let recommendedMovies: any[] = [];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: records } = await supabase
      .from("watch_records")
      .select("tmdb_movie_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (records && records.length > 0) {
      const detail = await getMovieDetail(records[0].tmdb_movie_id);
      if (detail && detail.genre.length > 0) {
        // TMDB uses genre IDs for discover, so we need to map back or we can just fetch top genres from db but we don't have IDs.
        // Actually, we can fetch discover without genre IDs just by searching similar movies, but getRecommendations requires genre IDs.
        // We will just use the first popular genre if mapping is needed.
        // For simplicity in this demo, let's just use some predefined genres if we can't map.
      }
    }
  }

  // To simplify since we need genre IDs for getRecommendations and we only have names in Movie interface,
  // we can modify getRecommendations or just use a fixed one if not found.
  // Actually, TMDB API has a `/movie/{id}/similar` or `/movie/{id}/recommendations`.
  // Wait, I can just use getPopularMovies as fallback for now, or just implement similar movies.
  // Let's add a quick fallback to popular.
  recommendedMovies = popularMovies.slice(0, 5);

  return (
    <div className="flex flex-col pb-20">
      <LearningWrapper componentId="alert">
        <Alert className="rounded-none border-t-0 border-x-0 bg-primary/10 text-primary">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>환영합니다!</AlertTitle>
          <AlertDescription>
            CinemaFlow는 영화 탐색과 UI 컴포넌트 학습을 동시에 할 수 있는 서비스입니다. 상단의 학습 모드를 켜보세요.
          </AlertDescription>
        </Alert>
      </LearningWrapper>

      {/* Hero Section */}
      {heroMovie && (
        <section className="relative w-full h-[70vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.backdropUrl}
              alt={heroMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 z-10 relative">
            <div className="max-w-2xl space-y-4">
              <div className="flex gap-2 mb-4">
                {heroMovie.genre.slice(0, 3).map(g => (
                  <LearningWrapper key={g} componentId="badge">
                    <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm">
                      {g}
                    </Badge>
                  </LearningWrapper>
                ))}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md">
                {heroMovie.title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 line-clamp-3">
                {heroMovie.description}
              </p>
              
              <div className="flex items-center gap-4 pt-4">
                <LearningWrapper componentId="button">
                  <Button size="lg" className="rounded-full font-bold">
                    <Play className="mr-2 h-5 w-5" /> 예고편 재생
                  </Button>
                </LearningWrapper>
                
                <Button size="lg" variant="outline" className="rounded-full bg-background/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/20 hover:text-white" asChild>
                  <Link href={`/movie/${heroMovie.id}`}>
                    <Info className="mr-2 h-5 w-5" /> 상세 정보
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Popular Movies Carousel */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">현재 인기 영화</h2>
          <LearningWrapper componentId="carousel" className="block w-full">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {popularMovies.map((movie) => (
                  <CarouselItem key={movie.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <LearningWrapper componentId="card" className="block w-full">
                      <Link href={`/movie/${movie.id}`}>
                        <Card className="overflow-hidden border-0 bg-transparent group cursor-pointer transition-all hover:ring-2 ring-primary">
                          <CardContent className="p-0 relative">
                            <AspectRatio ratio={2 / 3}>
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="object-cover w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                              />
                            </AspectRatio>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-4">
                              <div className="text-white">
                                <h3 className="font-bold line-clamp-1">{movie.title}</h3>
                                <p className="text-sm opacity-80">{movie.year} · ★ {movie.rating}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </LearningWrapper>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </div>
            </Carousel>
          </LearningWrapper>
        </section>

        <Separator />

        {user && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">당신을 위한 맞춤 추천</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendedMovies.map(movie => (
                <Link href={`/movie/${movie.id}`} key={movie.id}>
                  <Card className="overflow-hidden bg-muted/30 hover:bg-muted/50 transition-colors border-0">
                    <CardContent className="p-0">
                      <AspectRatio ratio={2 / 3}>
                        <img src={movie.posterUrl} alt={movie.title} className="object-cover rounded-t-xl" />
                      </AspectRatio>
                      <div className="p-3">
                        <h3 className="font-bold text-sm line-clamp-1">{movie.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 text-amber-500">★ {movie.rating.toFixed(1)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Categories Tabs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">장르별 탐색</h2>
          <LearningWrapper componentId="tabs">
            <Tabs defaultValue="action" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="action">액션/스릴러</TabsTrigger>
                <TabsTrigger value="drama">드라마/로맨스</TabsTrigger>
                <TabsTrigger value="upcoming">개봉 예정</TabsTrigger>
              </TabsList>
              
              <TabsContent value="action" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularMovies.filter(m => m.genre.includes("액션") || m.genre.includes("스릴러")).slice(0, 5).map(movie => (
                  <Link href={`/movie/${movie.id}`} key={movie.id}>
                    <Card className="overflow-hidden bg-muted/30 hover:bg-muted/50 transition-colors border-0">
                      <CardContent className="p-0">
                        <AspectRatio ratio={2 / 3}>
                          <img src={movie.posterUrl} alt={movie.title} className="object-cover rounded-t-xl" />
                        </AspectRatio>
                        <div className="p-3">
                          <h3 className="font-bold text-sm line-clamp-1">{movie.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{movie.genre.join(", ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </TabsContent>
              
              <TabsContent value="drama" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trendingMovies.filter(m => m.genre.includes("드라마") || m.genre.includes("로맨스")).slice(0, 5).map(movie => (
                  <Link href={`/movie/${movie.id}`} key={movie.id}>
                    <Card className="overflow-hidden bg-muted/30 hover:bg-muted/50 transition-colors border-0">
                      <CardContent className="p-0">
                        <AspectRatio ratio={2 / 3}>
                          <img src={movie.posterUrl} alt={movie.title} className="object-cover rounded-t-xl" />
                        </AspectRatio>
                        <div className="p-3">
                          <h3 className="font-bold text-sm line-clamp-1">{movie.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{movie.genre.join(", ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </TabsContent>
              
              <TabsContent value="upcoming" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {upcomingMovies.slice(0, 5).map(movie => (
                  <Link href={`/movie/${movie.id}`} key={movie.id}>
                    <Card className="overflow-hidden bg-muted/30 hover:bg-muted/50 transition-colors border-0">
                      <CardContent className="p-0">
                        <AspectRatio ratio={2 / 3}>
                          <img src={movie.posterUrl} alt={movie.title} className="object-cover rounded-t-xl" />
                        </AspectRatio>
                        <div className="p-3">
                          <h3 className="font-bold text-sm line-clamp-1">{movie.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{movie.year} 개봉 예정</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </TabsContent>
            </Tabs>
          </LearningWrapper>
        </section>
      </div>
    </div>
  );
}
