# CinemaFlow (1차 버전)

CinemaFlow는 영화를 탐색하고 감상 기록과 컬렉션을 관리하는 프리미엄 영화 플랫폼이자, `shadcn/ui` 컴포넌트의 실제 사용법을 학습할 수 있는 양방향 웹 서비스입니다.

## 프로젝트 목적
- **사용자 경험**: 실제 동작하는 프리미엄 영화 서비스를 통해 몰입감 있는 경험 제공
- **개발자 경험**: 화면 우측 상단의 "학습 모드"를 켜서 실제 UI에 사용된 shadcn/ui 컴포넌트들의 소스 코드, 사용 이유, 공식 문서 등을 양방향으로 학습할 수 있는 환경 제공

## 기술 스택
- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4)
- shadcn/ui (Radix Base)
- Zustand (상태 및 학습 진도 관리, localStorage 연동)

## 설치 및 실행 방법

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

접속 주소: [http://localhost:3000](http://localhost:3000)

## 페이지 구조
- **`/` (홈)**: 최신 인기 영화, 카테고리별 영화, 히어로 배너 제공
- **`/explore` (탐색)**: 다중 필터(장르, 평점) 및 정렬 기능이 포함된 영화 탐색 페이지
- **`/movie/[id]` (상세)**: 영화 상세 정보, 탭 UI(개요/출연진/리뷰), 가상 예고편 플레이어
- **`/record` (감상 기록)**: 폼 기반 감상평 작성 (유효성 검사 및 진행률 표시)
- **`/collection` (내 컬렉션)**: 저장된 영화들의 리스트/그리드 뷰, 분류 수정 및 삭제 기능 제공

## 학습 모드 사용법
1. 헤더 우측의 **'학습 모드' Switch**를 켭니다.
2. 화면 내 shadcn/ui 기반으로 작성된 UI(버튼, 카드, 캐러셀 등)에 마우스를 올리면 붉은색 외곽선이 표시됩니다.
3. 툴팁에 표시되는 '책 모양 아이콘'을 클릭하면 우측에서 상세 설명 패널(Sheet)이 열립니다.
4. 패널에서 해당 컴포넌트가 이 화면에 사용된 이유, 예제 코드, 공식 문서를 확인하고 '이해했습니다' 체크박스를 눌러 학습 진도를 채워보세요!

## 주요 사용된 shadcn 컴포넌트
- `Navigation Menu`, `Sheet`, `Dialog`, `Command`
- `Carousel`, `Tabs`, `Card`, `Aspect Ratio`, `Badge`, `Avatar`
- `Form`, `Input`, `Select`, `Slider`, `Checkbox`, `Radio Group`, `Date Picker(Calendar, Popover)`, `Textarea`, `Switch`, `Toggle Group`
- `Accordion`, `Scroll Area`, `Hover Card`, `Dropdown Menu`
- `Alert`, `Alert Dialog`, `Sonner(Toast)`, `Skeleton`, `Progress`, `Table`, `Pagination`, `Breadcrumb`, `Separator`

## 1차 구현 범위
- 프런트엔드 UI/UX 완성
- 로컬 Mock Data를 이용한 데이터 렌더링
- localStorage를 활용한 학습 모드 진도 저장 및 컬렉션 뷰 관리
- 전체 반응형 대응 및 다크 모드 스타일

## 2차 개발 예정 사항 (현재 미구현)
- TMDB 등 실제 영화 데이터 API 연동 및 환경변수(API Key) 관리
- Supabase 기반 로그인, 인증 및 사용자 데이터 영구 저장
- 감상 통계(취향 분석) 대시보드
- 개인 맞춤 영화 추천 알고리즘
- 컴포넌트 퀴즈 및 미션 기능
