"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";
import { movies, genres } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ExplorePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number[]>([0]);
  const [sort, setSort] = useState("latest");

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const filteredMovies = movies.filter(movie => {
    if (selectedGenres.length > 0 && !movie.genre.some(g => selectedGenres.includes(g))) return false;
    if (movie.rating < minRating[0]) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "latest") return b.year - a.year;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Filter className="w-5 h-5" /> 장르
        </h3>
        <LearningWrapper componentId="checkbox">
          <div className="grid grid-cols-2 gap-4">
            {genres.filter(g => g !== "전체").map(genre => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox 
                  id={`genre-${genre}`} 
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={() => toggleGenre(genre)}
                />
                <Label htmlFor={`genre-${genre}`} className="cursor-pointer">{genre}</Label>
              </div>
            ))}
          </div>
        </LearningWrapper>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">최소 평점</h3>
        <LearningWrapper componentId="slider">
          <div className="pt-4">
            <Slider
              defaultValue={[0]}
              max={10}
              step={0.5}
              value={minRating}
              onValueChange={setMinRating}
            />
            <div className="mt-2 text-right text-sm font-medium">
              ★ {minRating[0].toFixed(1)} 이상
            </div>
          </div>
        </LearningWrapper>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setSelectedGenres([]);
          setMinRating([0]);
        }}
      >
        필터 초기화
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">영화 탐색</h1>
            
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      필터
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle>필터</SheetTitle>
                    </SheetHeader>
                    <FilterContent />
                  </SheetContent>
                </Sheet>
              </div>

              <LearningWrapper componentId="select">
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="정렬 방식" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="rating">평점순</SelectItem>
                    <SelectItem value="title">가나다순</SelectItem>
                  </SelectContent>
                </Select>
              </LearningWrapper>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            총 {filteredMovies.length}개의 작품이 있습니다.
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
                          ★ {movie.rating}
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

          {filteredMovies.length > 0 && (
            <div className="pt-8">
              <LearningWrapper componentId="pagination">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
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
