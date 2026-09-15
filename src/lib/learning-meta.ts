export interface LearningMeta {
  id: string;
  name: string;
  description: string;
  purpose: string;
  reasonUsed: string;
  relatedComponents: string[];
  exampleCode: string;
  accessibility: string;
  docsUrl: string;
}

export const learningMetadata: Record<string, LearningMeta> = {
  button: {
    id: "button",
    name: "Button",
    description: "클릭 가능한 버튼 컴포넌트",
    purpose: "사용자의 동작을 트리거하거나 양식을 제출할 때 사용합니다.",
    reasonUsed: "영화 탐색, 감상 기록 제출 등 주요 사용자 액션을 위해 사용되었습니다.",
    relatedComponents: ["Tooltip", "Icon"],
    exampleCode: "<Button variant=\"default\">클릭하세요</Button>",
    accessibility: "키보드 포커스와 스페이스/엔터 키 입력을 기본 지원합니다.",
    docsUrl: "https://ui.shadcn.com/docs/components/button",
  },
  card: {
    id: "card",
    name: "Card",
    description: "콘텐츠를 그룹화하여 보여주는 컨테이너",
    purpose: "관련된 정보들을 시각적으로 묶어서 표현할 때 사용합니다.",
    reasonUsed: "영화의 포스터, 제목, 정보 등을 하나의 블록으로 묶어 보여주기 위해 사용되었습니다.",
    relatedComponents: ["Aspect Ratio", "Badge"],
    exampleCode: "<Card><CardHeader>제목</CardHeader><CardContent>내용</CardContent></Card>",
    accessibility: "적절한 헤딩 태그를 내부에 사용하여 구조를 명확히 해야 합니다.",
    docsUrl: "https://ui.shadcn.com/docs/components/card",
  },
  carousel: {
    id: "carousel",
    name: "Carousel",
    description: "콘텐츠를 가로로 스와이프하거나 넘겨보는 슬라이더",
    purpose: "한정된 공간에서 여러 항목을 보여줄 때 사용합니다.",
    reasonUsed: "인기 영화 목록과 같이 여러 개의 영화 카드를 스와이프하여 탐색할 수 있도록 사용되었습니다.",
    relatedComponents: ["Card"],
    exampleCode: "<Carousel><CarouselContent><CarouselItem>1</CarouselItem></CarouselContent></Carousel>",
    accessibility: "이전/다음 버튼에 명확한 aria-label이 필요하며 키보드 탐색을 지원합니다.",
    docsUrl: "https://ui.shadcn.com/docs/components/carousel",
  },
  dialog: {
    id: "dialog",
    name: "Dialog",
    description: "현재 화면 위에 뜨는 모달 팝업",
    purpose: "중요한 정보나 사용자 입력을 집중해서 받을 때 사용합니다.",
    reasonUsed: "예고편 영상 재생이나 통합 검색 등 화면 전환 없이 중요한 컨텍스트를 제공하기 위해 사용되었습니다.",
    relatedComponents: ["Button"],
    exampleCode: "<Dialog><DialogTrigger>열기</DialogTrigger><DialogContent>내용</DialogContent></Dialog>",
    accessibility: "열렸을 때 포커스가 다이얼로그 내부로 이동하며 ESC 키로 닫을 수 있어야 합니다.",
    docsUrl: "https://ui.shadcn.com/docs/components/dialog",
  },
  tabs: {
    id: "tabs",
    name: "Tabs",
    description: "관련 콘텐츠를 탭으로 전환하여 보여주는 컴포넌트",
    purpose: "섹션을 나누어 한 번에 하나의 콘텐츠만 보여줄 때 사용합니다.",
    reasonUsed: "홈 화면의 장르별 영화나 상세 페이지의 줄거리/출연진/리뷰 전환에 사용되었습니다.",
    relatedComponents: ["Card"],
    exampleCode: "<Tabs defaultValue=\"tab1\"><TabsList><TabsTrigger value=\"tab1\">탭1</TabsTrigger></TabsList><TabsContent value=\"tab1\">내용</TabsContent></Tabs>",
    accessibility: "방향키를 사용하여 탭 간 이동이 가능해야 합니다.",
    docsUrl: "https://ui.shadcn.com/docs/components/tabs",
  },
};
