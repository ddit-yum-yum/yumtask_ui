# yumtask_ui 프로젝트 규칙

## 프로젝트 개요

React + TypeScript 기반 yumtask 프론트엔드.
공통 UI는 퍼블리셔가 관리하고, 멤버(`zeenee`, `zenny`)는 같은 과제를 각자의 작업 공간에서 구현한다.
백엔드는 멤버별 저장소이며, 로컬에서 `localhost:8080`으로 실행한다.

## 기술 스택

React · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · React Router · react-hook-form + zod · **npm**

전역 상태·서버 데이터 라이브러리(Zustand, Redux, TanStack Query, SWR 등)는 사용하지 않는다. React 기본기(`useState`, `useEffect`, props)로 구현한다. 필요해지면 팀에서 결정한 뒤 도입한다.

## 명령어

```bash
npm run dev       # 개발 서버 (localhost:5173, /api → localhost:8080 proxy)
npm run build     # 프로덕션 빌드
npm run lint      # ESLint
npm run format    # Prettier (Tailwind 클래스 자동 정렬)
```

## 디렉토리 구조

> 폴더: **kebab-case** / 컴포넌트: **PascalCase.tsx** / 훅·유틸: **camelCase.ts**

```
src/
├── components/
│   ├── ui/              # shadcn 기반 공통 컴포넌트 (퍼블리셔 전용)
│   └── common/          # 공통 조합 컴포넌트 (퍼블리셔 전용)
├── layouts/             # 공통 레이아웃 (퍼블리셔 전용)
├── lib/                 # cn(), apiClient 등 공용 유틸
├── styles/              # Tailwind 진입 CSS, @theme 토큰
├── router/index.tsx     # 멤버 routes 연결 (관리자 전용)
└── members/{member}/    # 멤버 작업 공간
    ├── routes.tsx       # 이 멤버의 라우트
    └── features/{domain}/
        ├── components/  # 화면 위주 컴포넌트
        ├── hooks/       # 로직 (use{Name}.ts)
        ├── api/         # API 호출 ({domain}Api.ts)
        ├── types.ts     # 타입 정의
        └── pages/       # 라우트에 연결되는 페이지
```

폴더는 필요할 때 만든다. 빈 폴더를 미리 만들지 않는다.

## 작업 공간 규칙 (가장 중요)

- 멤버는 **`src/members/{본인}/` 안의 파일만** 수정한다
- 다른 멤버 폴더의 코드를 **import하지 않는다**
- 라우트는 **`members/{본인}/routes.tsx`에만** 추가한다. 주소는 `/{member}/...` 형식
- 공통 영역(`components`, `layouts`, `styles`, `lib`, `router`) 수정이 필요하면 **이슈로 요청**한다
- 타입과 API는 멤버끼리 공유하지 않는다. 각자 자기 폴더에 정의한다

## 핵심 코딩 규칙

### React 컴포넌트

- 함수 컴포넌트 + `type Props = { ... }`
- 이벤트 핸들러: `handle{Action}` 형식 (예: `handleSubmit`, `handleDelete`)
- **컴포넌트는 화면 위주** — 데이터 가져오기·계산 로직은 `hooks/`로 분리

### 절대 금지

- `components/ui`에 있는 컴포넌트를 Tailwind로 새로 만들기 → **반드시 공통 컴포넌트 사용** (`@/components/ui/button` 등)
- 색상 하드코딩 (`#3b5bdb`, `bg-[#...]`, `text-blue-500` 같은 기본 팔레트) → **테마 토큰만** (`bg-primary`, `text-muted-foreground`)
- 인라인 `style={{ ... }}` → Tailwind 클래스 사용
- 컴포넌트에서 `fetch` 직접 호출 → **`features/*/api/` 함수를 커스텀 훅(`hooks/`)에서 호출**
- `any` 타입
- 다른 멤버 폴더 import

### Hooks

- 파일명: `use{Name}.ts` — **한 훅에 모든 로직 금지**, 기능별 분리
- 예: `useRecipeList.ts`, `useRecipeCreate.ts`
- 서버 데이터 조회는 커스텀 훅 안에서 `useEffect` + `useState`로 처리하고, `data` · `isLoading` · `error`를 함께 반환한다
- 화면 상태는 컴포넌트의 `useState`와 props로 처리한다
- 라이브러리를 임의로 추가하지 않는다 (위 기술 스택 외 설치 금지)

### API

- 경로는 `/api/...` 상대 경로만 사용 (Vite proxy가 `localhost:8080`으로 전달)
- 파일명: `{domain}Api.ts`
- 반드시 `@/lib/apiClient` 경유
- 요청·응답 타입을 `types.ts`에 정의

### 폼

- react-hook-form + zod 스키마로 검증

### 주석

- 한국어, **한 줄로 핵심만**. 코드로 알 수 있는 내용은 쓰지 않는다
- 무엇을 하는지보다 **왜** 그렇게 했는지를 쓴다

| 상황 | 형식 | 예시 |
| --- | --- | --- |
| 함수·컴포넌트 설명 | `/** */` | `/** 레시피 목록 조회 */` |
| Props 필드 (공통 컴포넌트 필수) | `/** */` | `/** 버튼 스타일 */` |
| 이유가 필요한 로직 | `//` | `// 빈 목록이면 null이 와서 []로 변환` |
| 나중에 할 일 | `// TODO(멤버):` | `// TODO(zeenee): 페이지네이션 #15` |
| 알려진 문제 | `// FIXME(멤버):` | `// FIXME(zenny): 새로고침 시 중복 호출 #18` |
| 긴 JSX 영역 구분 | `{/* */}` | `{/* 검색 영역 */}` |

금지: 여러 줄 설명문, 주석 처리한 코드, 작성자·날짜 기록, `console.log`

## 자주 쓰는 패턴

```typescript
// 클래스 합치기
import { cn } from '@/lib/utils'
<div className={cn('p-4', isActive && 'bg-primary')} />

// API 함수 (members/zeenee/features/recipe/api/recipeApi.ts)
import { apiClient } from '@/lib/apiClient'
import type { Recipe } from '../types'
export const getRecipes = () => apiClient<Recipe[]>('/recipes')

// 조회 훅 (members/zeenee/features/recipe/hooks/useRecipeList.ts)
import { useEffect, useState } from 'react'
export function useRecipeList() {
  const [data, setData] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getRecipes()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}

// 라우트 (members/zeenee/routes.tsx)
export const zeeneeRoutes: RouteObject[] = [
  { path: 'recipes', element: <RecipeListPage /> },
]
```

## Git

- 브랜치: `{이슈번호}-{짧은-설명}` (예: `12-zeenee-recipe-list`)
- 커밋: `type(scope): 한글 제목` — `.gitmessage` 참고. scope는 멤버 이름 또는 공통 영역 이름
  - 예: `feat(zeenee): 레시피 목록 화면 추가`, `ui(button): 사이즈 variant 추가`
- PR 대상은 `develop`. 승인·머지는 관리자가 한다

## API 규약 (백엔드와 공통)

포트 `8080` · 경로 `/api/**` · 테스트 API `GET /api/hello` → `{"message": "..."}`
