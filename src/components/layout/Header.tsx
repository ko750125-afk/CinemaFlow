"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Film, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLearningStore } from "@/lib/store";
import { learningMetadata } from "@/lib/learning-meta";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { LearningWrapper } from "../learning/LearningWrapper";
import { LogOut, User } from "lucide-react";
import { logout } from "@/app/login/actions";

interface HeaderProps {
  user: any;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const { isLearningMode, toggleLearningMode, learnedComponents } = useLearningStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { name: "홈", path: "/" },
    { name: "영화 탐색", path: "/explore" },
    { name: "내 컬렉션", path: "/collection" },
    { name: "취향 분석", path: "/insights" },
    { name: "학습 기록", path: "/learn" },
  ];

  const totalComponents = Object.keys(learningMetadata).length;
  const progressPercentage = totalComponents === 0 ? 0 : Math.round((learnedComponents.length / totalComponents) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-xl">CinemaFlow</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === item.path ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">검색</span>
          </Button>

          <div className="hidden md:flex items-center gap-2 border-l pl-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium">학습 모드</span>
              {isLearningMode && (
                <span className="text-xs text-muted-foreground">
                  {learnedComponents.length} / {totalComponents} 완료
                </span>
              )}
            </div>
            <LearningWrapper componentId="switch">
              <Switch
                checked={isLearningMode}
                onCheckedChange={toggleLearningMode}
                aria-label="학습 모드 토글"
              />
            </LearningWrapper>
          </div>

          <div className="hidden md:flex items-center gap-2 border-l pl-4 ml-2">
            {user ? (
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </form>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  로그인
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">메뉴 토글</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="px-7 flex flex-col gap-6">
                <Link href="/" className="flex items-center space-x-2">
                  <Film className="h-6 w-6 text-primary" />
                  <span className="font-bold">CinemaFlow</span>
                </Link>
                <div className="flex flex-col gap-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`text-lg font-medium transition-colors hover:text-foreground/80 ${
                        pathname === item.path ? "text-foreground" : "text-foreground/60"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t flex flex-col gap-4">
                  <div className="flex items-center justify-between pr-6">
                    <span className="text-base font-medium">학습 모드</span>
                    <Switch
                      checked={isLearningMode}
                      onCheckedChange={toggleLearningMode}
                    />
                  </div>
                  <div className="pr-6 pt-4 border-t">
                    {user ? (
                      <form action={logout} className="w-full">
                        <Button variant="outline" type="submit" className="w-full">
                          로그아웃
                        </Button>
                      </form>
                    ) : (
                      <Button variant="default" asChild className="w-full">
                        <Link href="/login">로그인</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} />
    </header>
  );
}
