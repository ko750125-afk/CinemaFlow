"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Film, User, Hash, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchMoviesAction } from "@/app/actions";
import { Movie } from "@/lib/mock-data";

// GENRE_MAP (from tmdb.ts)
const GENRE_MAP: Record<number, string> = {
  28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디", 80: "범죄", 99: "다큐멘터리", 
  18: "드라마", 10751: "가족", 14: "판타지", 36: "역사", 27: "공포", 10402: "음악", 
  9648: "미스터리", 10749: "로맨스", 878: "SF", 10770: "TV 영화", 53: "스릴러", 10752: "전쟁", 37: "서부"
};

interface GlobalSearchProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GlobalSearch({ open, setOpen }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const movies = await searchMoviesAction(query);
        setResults(movies);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const onSelectMovie = (id: string) => {
    setOpen(false);
    router.push(`/movie/${id}`);
  };

  const onSelectGenre = (id: string) => {
    setOpen(false);
    router.push(`/explore?with_genres=${id}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="영화, 배우, 감독 검색..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
          <div className="p-4 flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 검색 중...
          </div>
        )}
        
        {!isLoading && query && results.length === 0 && (
          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        )}
        
        {results.length > 0 && (
          <CommandGroup heading="영화 검색 결과">
            {results.map((movie) => (
              <CommandItem
                key={movie.id}
                value={`${movie.title}-${movie.id}`}
                onSelect={() => onSelectMovie(movie.id)}
              >
                <Film className="mr-2 h-4 w-4" />
                <span>{movie.title}</span>
                {movie.year > 0 && <span className="ml-2 text-xs text-muted-foreground">({movie.year})</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {!query && (
          <CommandGroup heading="장르 탐색 바로가기">
            {Object.entries(GENRE_MAP).slice(0, 8).map(([id, genre]) => (
              <CommandItem
                key={id}
                value={`genre-${id}`}
                onSelect={() => onSelectGenre(id)}
              >
                <Hash className="mr-2 h-4 w-4" />
                <span>{genre}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
