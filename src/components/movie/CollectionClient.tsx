"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { LayoutGrid, List, Trash2, Edit, MoreHorizontal, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LearningWrapper } from "@/components/learning/LearningWrapper";
import { toast } from "sonner";
import { deleteCollectionItem, updateCollectionItemStatus } from "@/app/collection/actions";

export interface DBCollectionItem {
  id: string;
  tmdb_movie_id: string;
  movie_title: string;
  poster_path: string | null;
  status: "watch-later" | "watched" | "favorite";
  created_at: string;
}

export function CollectionClient({ initialCollection }: { initialCollection: DBCollectionItem[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DBCollectionItem | null>(null);

  const handleDelete = async () => {
    if (selectedItem) {
      const res = await deleteCollectionItem(selectedItem.id);
      if (res?.error) {
        toast.error("오류 발생", { description: res.error });
      } else {
        toast.success("삭제되었습니다.");
      }
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (selectedItem) {
      const res = await updateCollectionItemStatus(selectedItem.id, status);
      if (res?.error) {
        toast.error("오류 발생", { description: res.error });
      } else {
        toast.success("분류가 변경되었습니다.");
      }
      setIsEditOpen(false);
    }
  };

  const getCollectionItems = (status: "watch-later" | "watched" | "favorite") => {
    return initialCollection.filter(item => item.status === status);
  };

  const renderGrid = (items: DBCollectionItem[]) => {
    if (items.length === 0) return <EmptyState />;
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden bg-muted/30 hover:bg-muted/50 border-0 group relative">
            <Link href={`/movie/${item.tmdb_movie_id}`}>
              <CardContent className="p-0">
                <AspectRatio ratio={2/3}>
                  <img src={item.poster_path || "https://via.placeholder.com/600x900?text=No+Poster"} alt={item.movie_title} className="object-cover w-full h-full" />
                </AspectRatio>
              </CardContent>
            </Link>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <LearningWrapper componentId="dropdown-menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 backdrop-blur-md text-white border-none hover:bg-black/70">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsEditOpen(true); }}>
                      <Edit className="h-4 w-4 mr-2" /> 수정
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:bg-destructive/10" 
                      onClick={() => { setSelectedItem(item); setIsDeleteOpen(true); }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> 삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </LearningWrapper>
            </div>
            
            <div className="p-3">
              <h3 className="font-bold text-sm line-clamp-1">{item.movie_title}</h3>
              <p className="text-xs text-muted-foreground mt-1">추가일: {format(new Date(item.created_at), 'yyyy-MM-dd')}</p>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderList = (items: DBCollectionItem[]) => {
    if (items.length === 0) return <EmptyState />;
    
    return (
      <LearningWrapper componentId="table">
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">포스터</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>추가일</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-16 rounded overflow-hidden">
                      <img src={item.poster_path || "https://via.placeholder.com/600x900?text=No+Poster"} alt={item.movie_title} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/movie/${item.tmdb_movie_id}`} className="hover:underline">
                      {item.movie_title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(item.created_at), 'yyyy-MM-dd')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsEditOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setSelectedItem(item); setIsDeleteOpen(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </LearningWrapper>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed bg-muted/10">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
      <h3 className="text-xl font-bold mb-2">아직 추가된 영화가 없습니다</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        보고 싶은 영화나 감상한 영화를 컬렉션에 추가하여 관리해보세요.
      </p>
      <Button asChild>
        <Link href="/explore">영화 탐색하기</Link>
      </Button>
    </div>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">내 컬렉션</h1>
          <p className="text-muted-foreground">저장한 영화와 감상 기록을 한눈에 확인하세요.</p>
        </div>
        
        <LearningWrapper componentId="toggle-group">
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="그리드 보기">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="리스트 보기">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </LearningWrapper>
      </div>

      <LearningWrapper componentId="tabs">
        <Tabs defaultValue="watch-later" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="watch-later">보고 싶은 영화</TabsTrigger>
            <TabsTrigger value="watched">감상 완료</TabsTrigger>
            <TabsTrigger value="favorite">즐겨찾기</TabsTrigger>
          </TabsList>
          
          <TabsContent value="watch-later" className="mt-0">
            {viewMode === "grid" ? renderGrid(getCollectionItems("watch-later")) : renderList(getCollectionItems("watch-later"))}
          </TabsContent>
          <TabsContent value="watched" className="mt-0">
            {viewMode === "grid" ? renderGrid(getCollectionItems("watched")) : renderList(getCollectionItems("watched"))}
          </TabsContent>
          <TabsContent value="favorite" className="mt-0">
            {viewMode === "grid" ? renderGrid(getCollectionItems("favorite")) : renderList(getCollectionItems("favorite"))}
          </TabsContent>
        </Tabs>
      </LearningWrapper>

      {/* Delete Confirmation Alert Dialog */}
      <LearningWrapper componentId="alert-dialog">
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                이 작업은 취소할 수 없습니다. '{selectedItem?.movie_title}' 영화가 컬렉션에서 영구적으로 삭제됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                삭제하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </LearningWrapper>

      {/* Edit Sheet */}
      <LearningWrapper componentId="sheet">
        <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
          <SheetContent>
            <SheetHeader className="mb-6">
              <SheetTitle>컬렉션 수정</SheetTitle>
              <SheetDescription>
                {selectedItem?.movie_title}의 컬렉션 분류를 변경할 수 있습니다.
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">현재 분류</h4>
                <div className="flex gap-2 flex-col">
                  {["watch-later", "watched", "favorite"].map((status) => (
                    <Button 
                      key={status}
                      variant={selectedItem?.status === status ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => handleUpdateStatus(status)}
                    >
                      {status === "watch-later" ? "보고 싶은 영화" : status === "watched" ? "감상 완료" : "즐겨찾기"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </LearningWrapper>
    </>
  );
}
