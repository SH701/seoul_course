#  서울코스 (Seoul Course)

> **"오늘 어디 가지?"** 라는 고민을 없애주는 **AI 기반 서울 나들이 코스 추천 · 공유 서비스**

사용자는 AI 채팅으로 상황과 취향에 맞는 코스를 추천받고, 추천된 코스를 저장하거나 직접 만들고, 자신의 코스를 게시물로 공유할 수 있습니다.

🔗 **배포 주소**: [https://seoulcourse.vercel.app](https://seoulcourse.vercel.app)

<br />

##  핵심 기능

| 기능 | 설명 |
|------|------|
|  **AI 코스 추천** | 상황 입력(예: "비 오는 날 조용한 데") → AI가 실재하는 장소만 조합해 하루 코스 생성 |
|  **코스 생성·편집** | 추천 코스를 수정하거나 직접 커스텀 코스 제작 |
|  **장소·코스 저장** | 마음에 드는 장소/코스를 저장해 다시 확인 |
|  **게시물 공유** | 내 코스를 게시물로 공유 · 조회 / 수정 / 삭제(CRUD) |


##  기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | React Query (서버 상태), Zustand (UI 전역 상태) |
| Backend | Next.js API Routes, Prisma |
| Database | PostgreSQL |
| Auth | Clerk |
| AI | OpenAI API (gpt-4o / gpt-4o-mini) |
| External API | 네이버 지역검색, Google Places, OpenWeather |
| Deploy | Vercel |

<br />

##  폴더 구조

```
src/
├── app/
│   ├── api/            # 코스 생성 · 추천 · 장소 상세 · 날씨 등 API Routes
│   ├── main/           # 메인(지도·추천) 페이지
│   ├── post/           # 게시물 CRUD
│   └── me/             # 내 코스 · 저장 목록
├── components/         # 도메인별 컴포넌트 (chat, course, post, main ...)
├── hooks/              # React Query queries / mutations
├── store/              # Zustand 전역 스토어
├── lib/                # OpenAI · 날씨 · 유틸
└── data/               # 서울 자치구 정적 데이터
```
