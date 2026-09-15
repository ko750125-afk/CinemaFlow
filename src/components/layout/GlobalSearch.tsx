"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Film, User, Hash } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { movies, genres } from "@/lib/mock-data";

interface GlobalSearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function GlobalSearch({ open, setOpen }: GlobalSearchProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const onSelectMovie = (id: string) => {
    setOpen(false);
    router.push(`/movie/${id}`);
  };

  const onSelectGenre = (genre: string) => {
    setOpen(false);
    router.push(`/explore?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="영화, 배우, 감독, 장르 검색..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        
        <CommandGroup heading="영화">
          {movies.map((movie) => (
            <CommandItem
              key={movie.id}
              value={movie.title}
              onSelect={() => onSelectMovie(movie.id)}
            >
              <Film className="mr-2 h-4 w-4" />
              <span>{movie.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">({movie.year})</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandGroup heading="장르">
          {genres.filter(g => g !== "전체").map((genre) => (
            <CommandItem
              key={genre}
              value={genre}
              onSelect={() => onSelectGenre(genre)}
            >
              <Hash className="mr-2 h-4 w-4" />
              <span>{genre}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="인물 (감독/배우)">
          {/* Extract unique directors and cast */}
          {Array.from(new Set([
            ...movies.map(m => m.director),
            ...movies.flatMap(m => m.cast)
          ])).map((person) => (
            <CommandItem
              key={person}
              value={person}
              onSelect={() => {
                setOpen(false);
                router.push(`/explore?q=${encodeURIComponent(person)}`);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>{person}</span>
            </CommandItem>
          ))}
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  );
}
