"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TMDB Genre Map (from tmdb.ts)
const GENRE_MAP: Record<number, string> = {
  28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디", 80: "범죄", 99: "다큐멘터리", 
  18: "드라마", 10751: "가족", 14: "판타지", 36: "역사", 27: "공포", 10402: "음악", 
  9648: "미스터리", 10749: "로맨스", 878: "SF", 10770: "TV 영화", 53: "스릴러", 10752: "전쟁", 37: "서부"
};

export function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialGenres = searchParams.get("with_genres")?.split(",").map(Number) || [];
  const initialMinRating = searchParams.get("vote_average.gte") ? [Number(searchParams.get("vote_average.gte"))] : [0];
  const initialSort = searchParams.get("sort_by") || "popularity.desc";

  const [selectedGenres, setSelectedGenres] = useState<number[]>(initialGenres);
  const [minRating, setMinRating] = useState<number[]>(initialMinRating);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    if (selectedGenres.length > 0) params.set("with_genres", selectedGenres.join(","));
    if (minRating[0] > 0) params.set("vote_average.gte", minRating[0].toString());
    if (sort) params.set("sort_by", sort);
    
    // reset to page 1 on filter change
    params.set("page", "1");

    router.push(`/explore?${params.toString()}`);
  }, [selectedGenres, minRating, sort, router]);

  const toggleGenre = (id: number) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setMinRating([0]);
    setSort("popularity.desc");
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Filter className="w-5 h-5" /> 장르
        </h3>
        <LearningWrapper componentId="checkbox">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(GENRE_MAP).map(([idStr, name]) => {
              const id = Number(idStr);
              return (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`genre-${id}`} 
                    checked={selectedGenres.includes(id)}
                    onCheckedChange={() => toggleGenre(id)}
                  />
                  <Label htmlFor={`genre-${id}`} className="cursor-pointer">{name}</Label>
                </div>
              );
            })}
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
        onClick={resetFilters}
      >
        필터 초기화
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Top Actions */}
      <div className="flex md:hidden items-center justify-between w-full mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              필터
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>필터</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Select is positioned externally by the layout, but we can export it or render it here absolute? 
          Actually let's just render the Sort select as part of a portal or alongside the title.
          For simplicity, we'll expose a SortSelect component or render it here if possible. 
          Wait, the structure requires Sort to be next to the title. I'll split it.
      */}
    </>
  );
}

export function ExploreSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort_by") || "popularity.desc";

  const setSort = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", val);
    params.set("page", "1");
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <LearningWrapper componentId="select">
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="정렬 방식" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popularity.desc">인기순</SelectItem>
          <SelectItem value="primary_release_date.desc">최신순</SelectItem>
          <SelectItem value="vote_average.desc">평점순</SelectItem>
        </SelectContent>
      </Select>
    </LearningWrapper>
  );
}
