import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ExploreFilters, ExploreSortSelect } from "@/components/movie/ExploreFilters";
import { discoverMovies } from "@/lib/tmdb";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  const page = Number(resolvedParams.page) || 1;
  const with_genres = typeof resolvedParams.with_genres === "string" ? resolvedParams.with_genres : undefined;
  const vote_average_gte = typeof resolvedParams["vote_average.gte"] === "string" ? resolvedParams["vote_average.gte"] : undefined;
  const sort_by = typeof resolvedParams.sort_by === "string" ? resolvedParams.sort_by : "popularity.desc";

  const fetchParams: Record<string, string> = {
    page: page.toString(),
    sort_by,
    "vote_count.gte": "50", // 최소 50명 이상이 평가한 영화만 노출 (쓰레기/더미 데이터 방지)
  };

  if (sort_by === "primary_release_date.desc") {
    // 최신순일 경우 미래 날짜(더미 데이터 등) 제외하고 오늘 날짜까지만 노출
    fetchParams["primary_release_date.lte"] = new Date().toISOString().split("T")[0];
  }

  if (with_genres) fetchParams.with_genres = with_genres;
  if (vote_average_gte) fetchParams["vote_average.gte"] = vote_average_gte;

  const { results: filteredMovies, totalPages } = await discoverMovies(fetchParams);

  // Pagination Helper
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    if (with_genres) params.set("with_genres", with_genres);
    if (vote_average_gte) params.set("vote_average.gte", vote_average_gte);
    params.set("sort_by", sort_by);
    params.set("page", pageNumber.toString());
    return `/explore?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        <Suspense fallback={<div className="w-64"><Skeleton className="h-96 w-full" /></div>}>
          <ExploreFilters />
        </Suspense>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">영화 탐색</h1>
            <div className="flex items-center gap-4">
              <Suspense fallback={<Skeleton className="w-[140px] h-10" />}>
                <ExploreSortSelect />
              </Suspense>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            탐색된 작품들입니다.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredMovies.map(movie => (
              <LearningWrapper key={movie.id} componentId="card">
                <Link href={`/movie/${movie.id}`}>
                  <Card className="overflow-hidden border-0 bg-transparent group cursor-pointer transition-all hover:ring-2 ring-primary h-full flex flex-col">
                    <CardContent className="p-0 relative">
                      <AspectRatio ratio={2 / 3}>
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="object-cover w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                      </AspectRatio>
                    </CardContent>
                    <div className="pt-3 pb-1">
                      <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                      <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground">
                        <span>{movie.year}</span>
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          ★ {movie.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </LearningWrapper>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
              <p className="text-muted-foreground">조건에 맞는 영화가 없습니다.</p>
            </div>
          )}

          {filteredMovies.length > 0 && totalPages > 1 && (
            <div className="pt-8">
              <LearningWrapper componentId="pagination">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={createPageURL(page - 1)} />
                      </PaginationItem>
                    )}
                    
                    {/* Show current, prev, next simply */}
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationLink href={createPageURL(page - 1)}>{page - 1}</PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationLink href={createPageURL(page)} isActive>{page}</PaginationLink>
                    </PaginationItem>
                    
                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationLink href={createPageURL(page + 1)}>{page + 1}</PaginationLink>
                      </PaginationItem>
                    )}

                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={createPageURL(page + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </LearningWrapper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
