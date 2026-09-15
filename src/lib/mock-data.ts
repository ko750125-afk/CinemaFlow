export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  duration: string;
  rating: number;
  ageRating: string;
  director: string;
  cast: string[];
  summary: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  isUpcoming?: boolean;
  videoKey?: string;
}

export const movies: Movie[] = [
  {
    id: "m1",
    title: "고요의 시간",
    year: 2024,
    genre: ["드라마", "SF"],
    duration: "115분",
    rating: 8.7,
    ageRating: "12세 이상 관람가",
    director: "이진우",
    cast: ["김하늘", "박해일", "이성민"],
    summary: "우주 정거장에서 홀로 남겨진 우주 비행사가 지구와의 통신을 시도하며 겪는 심리 스릴러.",
    description: "가까운 미래, 달 궤도의 정거장에서 알 수 없는 사고로 모두가 통신 두절된 가운데, 마지막 생존자 한수영이 지구 귀환을 위한 사투를 벌인다. 그 과정에서 자신의 과거와 맞닥뜨리는 심오한 드라마.",
    posterUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "m2",
    title: "어두운 골목의 추격자",
    year: 2023,
    genre: ["액션", "스릴러"],
    duration: "132분",
    rating: 9.1,
    ageRating: "15세 이상 관람가",
    director: "최동훈",
    cast: ["하정우", "김윤석", "전지현"],
    summary: "연쇄 살인마를 쫓는 은퇴한 형사의 마지막 추격전.",
    description: "서울의 복잡한 밤거리, 연쇄 살인마의 꼬리를 잡은 전직 형사가 모든 것을 걸고 추격에 나선다. 박진감 넘치는 액션과 반전의 반전이 이어지는 웰메이드 스릴러.",
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "m3",
    title: "봄날의 약속",
    year: 2024,
    genre: ["로맨스", "코미디"],
    duration: "105분",
    rating: 7.9,
    ageRating: "전체 관람가",
    director: "김태용",
    cast: ["박보영", "조정석"],
    summary: "우연히 만난 두 남녀가 서로의 상처를 치유해가는 따뜻한 로맨틱 코미디.",
    description: "작은 서점을 운영하는 지은과 유명 작가지만 슬럼프에 빠진 태현. 우연한 기회로 서점에서 낭독회를 열게 되면서 벌어지는 유쾌하고 감동적인 이야기.",
    posterUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: "m4",
    title: "그림자 제국",
    year: 2025,
    genre: ["판타지", "액션"],
    duration: "145분",
    rating: 0.0,
    ageRating: "미정",
    director: "이응복",
    cast: ["송중기", "김지원"],
    summary: "어둠이 지배하는 제국에 맞서는 빛의 기사들의 이야기.",
    description: "모든 빛을 잃어버린 가상의 제국, 예언된 영웅들이 어둠의 군주에 맞서 싸우기 위해 힘을 모은다.",
    posterUrl: "https://images.unsplash.com/photo-1501676491272-7bbd3e71f7e1?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
    isUpcoming: true,
  },
  {
    id: "m5",
    title: "기억의 파편",
    year: 2022,
    genre: ["미스터리", "드라마"],
    duration: "110분",
    rating: 8.3,
    ageRating: "15세 이상 관람가",
    director: "박찬욱",
    cast: ["유지태", "이영애"],
    summary: "잃어버린 기억을 찾아 나선 남자가 마주한 충격적인 진실.",
    description: "사고로 아내를 잃고 기억마저 잃은 남자가 남겨진 단서들을 조립하며 거대한 음모와 마주한다.",
    posterUrl: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1920&auto=format&fit=crop",
  }
];

export const genres = ["전체", "액션", "스릴러", "드라마", "SF", "로맨스", "코미디", "판타지", "미스터리"];

export interface CollectionItem {
  id: string;
  movieId: string;
  title: string;
  addedAt: string;
  type: "watch-later" | "watched" | "favorite";
}

export const initialCollection: CollectionItem[] = [
  { id: "c1", movieId: "m1", title: "고요의 시간", addedAt: "2024-03-10", type: "favorite" },
  { id: "c2", movieId: "m2", title: "어두운 골목의 추격자", addedAt: "2024-03-12", type: "watched" },
  { id: "c3", movieId: "m3", title: "봄날의 약속", addedAt: "2024-03-15", type: "watch-later" },
];
