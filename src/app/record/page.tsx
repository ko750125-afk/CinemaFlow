import { Progress } from "@/components/ui/progress";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import { getMovieDetail } from "@/lib/tmdb";
import { RecordForm } from "@/components/movie/RecordForm";

export default async function RecordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const movieId = typeof resolvedParams.movieId === "string" ? resolvedParams.movieId : undefined;
  
  let initialMovieTitle;
  let initialPosterPath;

  if (movieId) {
    try {
      const movie = await getMovieDetail(movieId);
      if (movie) {
        initialMovieTitle = movie.title;
        initialPosterPath = movie.posterUrl;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">감상 기록 작성</h1>
        <p className="text-muted-foreground">당신의 소중한 영화 감상을 기록으로 남겨보세요.</p>
      </div>

      <LearningWrapper componentId="progress">
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span>작성 진행률</span>
            <span className="font-medium">안내</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      </LearningWrapper>

      <RecordForm 
        initialMovieId={movieId} 
        initialMovieTitle={initialMovieTitle}
        initialPosterPath={initialPosterPath}
      />
    </div>
  );
}
