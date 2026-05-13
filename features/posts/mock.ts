import type { Post } from "@/features/posts/types"

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    name: "Sean",
    handle: "sean_dev",
    avatar: "https://i.pravatar.cc/150?img=12",
    time: "2h",
    content:
      "Next.js 16 + Tailwind v4 조합으로 X 클론 시작. 풀스택 학습이 목표라 일부러 빠른 길보다 현업스러운 길을 골라봄.",
    replies: 4,
    reposts: 1,
    likes: 23,
  },
  {
    id: "2",
    name: "Mina Park",
    handle: "minacodes",
    avatar: "https://i.pravatar.cc/150?img=47",
    time: "5h",
    content:
      "타임라인 pull model로 먼저 만들어보고 나중에 push fanout으로 마이그레이션하는 게 학습 가치 면에서 훨씬 좋다. 결과만 보면 push가 정답인데, 왜 그게 정답인지는 pull을 직접 굴려봐야 안다.",
    replies: 12,
    reposts: 8,
    likes: 142,
  },
  {
    id: "3",
    name: "Hyunwoo",
    handle: "hwlog",
    avatar: "https://i.pravatar.cc/150?img=33",
    time: "1d",
    content:
      "Shadcn Nova preset 색감이 생각보다 X 분위기랑 잘 맞는다. 다크 모드 기본 + zinc 계열 구분선.",
    replies: 2,
    reposts: 0,
    likes: 17,
  },
  {
    id: "4",
    name: "Jules",
    handle: "jules",
    avatar: "https://i.pravatar.cc/150?img=5",
    time: "1d",
    content:
      "오늘의 교훈: Tailwind v4는 tailwind.config.js 없다. CSS-first config 적응되니까 오히려 깔끔함.",
    replies: 6,
    reposts: 3,
    likes: 58,
  },
]
