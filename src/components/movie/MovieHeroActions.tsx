"use client";

import { useState } from "react";
import { Play, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { addToCollection } from "@/app/collection/actions";

interface MovieHeroActionsProps {
  movieId: string;
  movieTitle: string;
  backdropUrl: string;
  posterUrl: string;
  videoKey?: string;
}

export function MovieHeroActions({ movieId, movieTitle, backdropUrl, posterUrl, videoKey }: MovieHeroActionsProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleAddToCollection = async () => {
    const res = await addToCollection({
      tmdb_movie_id: movieId,
      movie_title: movieTitle,
      poster_path: posterUrl,
      status: "watch-later"
    });
    
    if (res?.error) {
      toast.error("오류 발생", { description: res.error });
      return;
    }

    toast.success("컬렉션에 추가되었습니다", {
      description: `"${movieTitle}" 영화가 '보고 싶은 영화'에 추가되었습니다.`,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-4">
      <LearningWrapper componentId="dialog">
        <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full font-bold">
              <Play className="mr-2 h-5 w-5" /> 예고편 재생
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black border-white/10">
            <DialogHeader className="p-4 absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent">
              <DialogTitle className="text-white opacity-0">{movieTitle} 예고편</DialogTitle>
              <DialogDescription className="opacity-0">예고편 재생</DialogDescription>
            </DialogHeader>
            <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center relative">
              {videoKey ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                  title={`${movieTitle} 예고편`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img src={backdropUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <div className="z-10 text-center space-y-2">
                    <Play className="w-16 h-16 mx-auto text-white/80" />
                    <p className="text-white/80 font-medium">공식 예고편 영상이 제공되지 않습니다.</p>
                  </div>
                </>
              )}
            </AspectRatio>
          </DialogContent>
        </Dialog>
      </LearningWrapper>

      <Button size="lg" variant="secondary" className="rounded-full" onClick={handleAddToCollection}>
        <Plus className="mr-2 h-5 w-5" /> 내 컬렉션
      </Button>
      
      <Button size="icon" variant="outline" className="rounded-full border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/20">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
