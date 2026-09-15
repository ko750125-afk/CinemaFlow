"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Star, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import { cn } from "@/lib/utils";
import { saveWatchRecord } from "@/app/record/actions";

interface RecordFormProps {
  initialMovieId?: string;
  initialMovieTitle?: string;
  initialPosterPath?: string;
}

export function RecordForm({ initialMovieId, initialMovieTitle, initialPosterPath }: RecordFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [rating, setRating] = useState([5]);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: initialMovieTitle || "",
    place: "",
    oneLiner: "",
    review: "",
    isSpoiler: false,
    visibility: "private"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const totalFields = 5;
    let filled = 1;
    if (value.length > 0) filled++;
    if (name !== 'title' && formData.title) filled++;
    if (name !== 'place' && formData.place) filled++;
    if (name !== 'oneLiner' && formData.oneLiner) filled++;
    if (name !== 'review' && formData.review) filled++;
    
    setProgress(Math.min(100, (filled / totalFields) * 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("영화 제목을 입력해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    
    const res = await saveWatchRecord({
      tmdb_movie_id: initialMovieId || "custom-" + Date.now(),
      movie_title: formData.title,
      poster_path: initialPosterPath,
      rating: rating[0],
      viewed_at: date,
      place: formData.place,
      one_liner: formData.oneLiner,
      review: formData.review,
      is_spoiler: formData.isSpoiler,
      visibility: formData.visibility,
    });

    setIsSubmitting(false);

    if (res?.error) {
      toast.error("오류 발생", { description: res.error });
      return;
    }

    toast.success("기록이 저장되었습니다!", {
      description: `'${formData.title}'에 대한 감상평이 성공적으로 등록되었습니다.`,
      icon: <CheckCircle2 className="text-green-500" />
    });
    router.push("/collection");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
      <div className="space-y-4">
        <LearningWrapper componentId="input">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold flex">영화 제목 <span className="text-destructive ml-1">*</span></Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="어떤 영화를 보셨나요?" 
              value={formData.title}
              onChange={handleChange}
              readOnly={!!initialMovieTitle}
              className={cn("text-lg py-6", initialMovieTitle && "bg-muted cursor-not-allowed")}
            />
          </div>
        </LearningWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LearningWrapper componentId="calendar">
          <div className="space-y-2">
            <Label className="text-base font-semibold">감상 날짜</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal py-6",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </LearningWrapper>

        <LearningWrapper componentId="select">
          <div className="space-y-2">
            <Label className="text-base font-semibold">감상 장소</Label>
            <Select name="place" onValueChange={(v) => setFormData(p => ({...p, place: v}))}>
              <SelectTrigger className="py-6">
                <SelectValue placeholder="어디서 보셨나요?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cinema">영화관</SelectItem>
                <SelectItem value="home">집 (TV, PC, 모바일)</SelectItem>
                <SelectItem value="airplane">비행기</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </LearningWrapper>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">별점</Label>
          <span className="flex items-center gap-1 font-bold text-lg text-amber-500">
            <Star className="w-5 h-5 fill-current" /> {rating[0].toFixed(1)}
          </span>
        </div>
        <LearningWrapper componentId="slider">
          <Slider
            defaultValue={[5]}
            max={10}
            step={0.5}
            value={rating}
            onValueChange={setRating}
            className="py-4"
          />
        </LearningWrapper>
      </div>

      <div className="space-y-2">
        <Label htmlFor="oneLiner" className="text-base font-semibold">한줄평</Label>
        <Input 
          id="oneLiner" 
          name="oneLiner" 
          placeholder="영화의 느낌을 한 줄로 요약해주세요."
          value={formData.oneLiner}
          onChange={handleChange}
        />
      </div>

      <LearningWrapper componentId="textarea">
        <div className="space-y-2">
          <Label htmlFor="review" className="text-base font-semibold">상세 감상평</Label>
          <Textarea 
            id="review" 
            name="review" 
            placeholder="영화에 대한 자세한 생각, 기억에 남는 대사나 장면 등을 자유롭게 적어주세요."
            className="min-h-[150px] resize-none"
            value={formData.review}
            onChange={handleChange}
          />
        </div>
      </LearningWrapper>

      <div className="flex flex-col md:flex-row gap-6 p-4 bg-muted/50 rounded-xl border">
        <LearningWrapper componentId="switch">
          <div className="flex items-center justify-between flex-1">
            <div className="space-y-0.5">
              <Label htmlFor="spoiler" className="text-base font-medium">스포일러 포함</Label>
              <p className="text-sm text-muted-foreground">리뷰 내용에 스포일러가 있나요?</p>
            </div>
            <Switch 
              id="spoiler" 
              checked={formData.isSpoiler}
              onCheckedChange={(c) => setFormData(p => ({...p, isSpoiler: c}))}
            />
          </div>
        </LearningWrapper>
        
        <div className="w-px bg-border hidden md:block" />

        <LearningWrapper componentId="radio-group">
          <div className="flex-1 space-y-3">
            <Label className="text-base font-medium">공개 설정</Label>
            <RadioGroup 
              defaultValue="private" 
              value={formData.visibility}
              onValueChange={(v) => setFormData(p => ({...p, visibility: v}))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">전체 공개</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">친구만</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="r3" />
                <Label htmlFor="r3" className="cursor-pointer">비공개</Label>
              </div>
            </RadioGroup>
          </div>
        </LearningWrapper>
      </div>

      <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : "기록 저장하기"}
      </Button>
    </form>
  );
}
