import Link from "next/link";
import { Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getMovieDetail, getPopularMovies } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import { MovieHeroActions } from "@/components/movie/MovieHeroActions";

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetail(id);

  if (!movie) {
    notFound();
  }

  // 비슷한 콘텐츠를 위해 일단 인기 영화를 불러옵니다 (실제로는 getRecommendations(id)를 써도 됨)
  const relatedMovies = await getPopularMovies();
  const filteredRelated = relatedMovies.filter(m => m.id !== movie.id).slice(0, 4);

  return (
    <div className="flex flex-col pb-20">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-end pb-8">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="mb-6 hidden md:block">
            <LearningWrapper componentId="breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">홈</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/explore">영화 탐색</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">{movie.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </LearningWrapper>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div className="w-32 md:w-48 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 hidden md:block">
              <AspectRatio ratio={2 / 3}>
                <img src={movie.posterUrl} alt={movie.title} className="object-cover" />
              </AspectRatio>
            </div>
            
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" /> {movie.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {movie.year}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {movie.duration}
                </span>
                <span>{movie.ageRating}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {movie.genre.map(g => (
                  <Badge key={g} variant="outline" className="text-white border-white/30 bg-white/5 backdrop-blur-sm">
                    {g}
                  </Badge>
                ))}
              </div>
              
              <MovieHeroActions 
                movieId={movie.id}
                movieTitle={movie.title} 
                backdropUrl={movie.backdropUrl} 
                posterUrl={movie.posterUrl}
                videoKey={movie.videoKey} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 space-y-8">
            <LearningWrapper componentId="tabs">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 space-x-6">
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 data-[state=active]:shadow-none"
                  >
                    개요
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cast" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 data-[state=active]:shadow-none"
                  >
                    출연진
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 data-[state=active]:shadow-none"
                  >
                    리뷰
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">줄거리</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {movie.description}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4">상세 정보</h3>
                    <LearningWrapper componentId="accordion">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>감독 및 제작진</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-muted-foreground block text-sm">감독</span>
                                <span className="font-medium">{movie.director}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-sm">제작국가</span>
                                <span className="font-medium">TMDB 데이터</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>부가 정보</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">이 영화는 TMDB API를 통해 가져온 실제 데이터입니다.</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </LearningWrapper>
                  </div>
                </TabsContent>
                
                <TabsContent value="cast" className="pt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {/* Director */}
                    <LearningWrapper componentId="hover-card">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <Avatar className="h-12 w-12 border">
                              <AvatarFallback>{movie.director[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium line-clamp-1">{movie.director}</p>
                              <p className="text-xs text-muted-foreground">감독</p>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <Avatar>
                              <AvatarFallback>{movie.director[0]}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">{movie.director}</h4>
                              <p className="text-sm">영화 감독입니다.</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </LearningWrapper>

                    {/* Cast */}
                    {movie.cast.map((actor, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2">
                        <Avatar className="h-12 w-12 border">
                          <AvatarFallback>{actor[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium line-clamp-1">{actor}</p>
                          <p className="text-xs text-muted-foreground">배우</p>
                        </div>
                      </div>
                    ))}
                    {movie.cast.length === 0 && (
                      <p className="text-muted-foreground">출연진 정보가 없습니다.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">사용자 리뷰</h3>
                    <Button variant="outline" asChild>
                      <Link href={`/record?movieId=${movie.id}`}>리뷰 작성하기</Link>
                    </Button>
                  </div>
                  
                  <LearningWrapper componentId="scroll-area">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        <div className="bg-muted/30 p-4 rounded-xl space-y-3 border text-center py-8">
                          <p className="text-muted-foreground">아직 작성된 리뷰가 없습니다.</p>
                          <Button variant="link" asChild>
                            <Link href={`/record?movieId=${movie.id}`}>첫 번째 리뷰를 남겨보세요!</Link>
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>
                  </LearningWrapper>
                </TabsContent>
              </Tabs>
            </LearningWrapper>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <h3 className="font-bold text-lg">비슷한 콘텐츠</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {filteredRelated.map(related => (
                <Link href={`/movie/${related.id}`} key={related.id}>
                  <div className="flex gap-3 group cursor-pointer">
                    <div className="w-16 md:w-20 shrink-0 rounded-md overflow-hidden bg-muted">
                      <AspectRatio ratio={2/3}>
                        <img src={related.posterUrl} alt={related.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                      </AspectRatio>
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{related.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{related.year}</p>
                      <div className="text-xs text-amber-500 font-medium mt-1">★ {related.rating.toFixed(1)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
