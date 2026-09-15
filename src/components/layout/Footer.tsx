import Link from "next/link";
import { Film, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LearningWrapper } from "../learning/LearningWrapper";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold text-xl">CinemaFlow</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              실시간 영화탐색과 shadcn 컴포넌트 학습을 위한 플랫폼
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4">
              이 서비스는 TMDB API를 사용하여 실시간 제공되고 있습니다.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>ko750125@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>고객센터: 010-2578-1126</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <LearningWrapper componentId="dialog">
                <Dialog>
                  <DialogTrigger className="text-left hover:text-foreground transition-colors w-fit">
                    이용약관
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>이용약관</DialogTitle>
                      <DialogDescription>CinemaFlow 서비스 이용약관</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] mt-4 rounded-md border p-4 text-sm text-muted-foreground">
                      제1조 (목적) <br />
                      본 약관은 KOAI LABS(이하 "회사")가 제공하는 CinemaFlow 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
                      <br /><br />
                      제2조 (용어의 정의) <br />
                      1. "서비스"라 함은 단말기(PC, 휴대형 단말기 등의 각종 유무선 장치를 포함)에 상관없이 회원이 이용할 수 있는 CinemaFlow 관련 제반 서비스를 의미합니다. <br />
                      2. "회원"이라 함은 회사의 "서비스"에 접속하여 본 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.
                      <br /><br />
                      제3조 (약관의 게시와 개정) <br />
                      회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
                      <br /><br />
                      (본 약관은 더미 텍스트입니다.)
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </LearningWrapper>

              <Dialog>
                <DialogTrigger className="text-left hover:text-foreground transition-colors w-fit">
                  개인정보처리방침
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>개인정보처리방침</DialogTitle>
                    <DialogDescription>KOAI LABS 개인정보처리방침</DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] mt-4 rounded-md border p-4 text-sm text-muted-foreground">
                    KOAI LABS는 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
                    <br /><br />
                    1. 수집하는 개인정보 항목<br />
                    회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br />
                    - 수집항목 : 이메일, 이름, 프로필 사진<br />
                    <br />
                    2. 개인정보의 수집 및 이용목적<br />
                    회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
                    - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 콘텐츠 제공, 맞춤형 영화 추천<br />
                    <br />
                    (본 방침은 더미 텍스트입니다.)
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 KOAI LABS. All rights reserved.</p>
          <p>대표: 고병일</p>
        </div>
      </div>
    </footer>
  );
}
