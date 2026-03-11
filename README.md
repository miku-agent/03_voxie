# Voxie

보컬로이드 서브컬쳐를 위한 **deck-first / curator-first 플랫폼**입니다.

Voxie는 곡, 대사, 밈, 순간 같은 보컬로이드 관련 장면을 **카드**로 모으고,
그 카드를 **덱**으로 엮어 큐레이터의 해석과 흐름을 공유하게 만드는 프로젝트입니다.

---

## 제품 한 줄 요약
> 카드 아카이브를 넘어, **덱 문화와 큐레이터 정체성**을 중심에 두는 Voxie.

제품 방향 문서는 `docs/product-direction.md`를 참고하세요.

---

## 현재 상태
Voxie는 이미 핵심 MVP 흐름이 구현된 상태입니다.

### 현재 가능한 기능
- deck-first 홈/랜딩 경험
- 카드 목록 보기
- 태그 필터 / 검색
- 카드 상세 보기
- 카드 작성
- 덱 목록 / 검색
- 덱 상세 보기
- 덱 생성
- 덱 수정
- author attribution / 프로필 링크
- 덱 공유 링크 / 공유 UX

### 데이터 동작 방식
Voxie는 현재 **fallback-safe + Supabase transition** 구조로 동작합니다.

- Supabase 환경 변수가 **없으면** 로컬 seed 데이터로 읽기 동작
- Supabase 환경 변수가 **있으면** 카드/덱 read/write를 Supabase로 처리
- 카드 생성 / 덱 생성 / 덱 수정은 **Supabase가 설정된 경우에만 저장 가능**

즉, 로컬 개발 환경에서는 seed fallback으로 앱을 계속 확인할 수 있고,
운영 환경에서는 Supabase를 primary 데이터 소스로 사용합니다.

---

## 주요 라우트
- `/` — 홈 피드 (deck-first landing, 카드 검색/태그 필터)
- `/cards/[slug]` — 카드 상세
- `/cards/new` — 카드 작성
- `/decks` — 덱 목록 / 검색
- `/decks/[slug]` — 덱 상세 / 공유
- `/decks/new` — 덱 생성
- `/decks/[slug]/edit` — 덱 수정
- `/users/[handle]` — 큐레이터 프로필

---

## 기술 스택
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase
- Vitest
- Playwright
- pnpm

---

## 로컬 실행

### 1) 의존성 설치
```bash
pnpm install
```

### 2) 개발 서버 실행
```bash
pnpm dev
```

### 3) 검증 명령
```bash
pnpm typecheck
pnpm test
pnpm build
```

E2E 테스트:
```bash
pnpm test:e2e
```

---

## Supabase 설정

### 환경 변수
`.env.local`에 아래 값을 설정합니다.

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

이 값들은 현재 **Next 서버 측 경로**에서 사용합니다.
브라우저 공개용 `NEXT_PUBLIC_*` 기준으로 직접 붙는 구조를 전제로 하지 않습니다.

### 데이터베이스 초기화
Supabase SQL Editor에서 아래 파일을 순서대로 실행합니다.

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed.sql` (선택)

자세한 설계는 `docs/supabase-schema.md`를 참고하세요.

---

## 데이터 소스 구조

### Fallback 데이터
- `src/data/seed.json`
- `src/data/decks.json`

Supabase가 설정되지 않은 환경에서도 읽기 화면이 동작하도록 유지합니다.

### Supabase 테이블
- `cards`
- `decks`
- `deck_cards`

현재 앱은 읽기 경로에서 **Supabase 우선 + fallback 지원** 전략을 사용하고,
쓰기 경로는 Supabase가 설정된 경우에만 활성화됩니다.

---

## 테스트 범위
현재 저장소에는 다음 테스트가 포함되어 있습니다.

### Vitest
- 카드 form helper 테스트
- 덱 form helper 테스트
- 덱 edit helper 테스트
- 카드/덱 조회 테스트
- 검색 테스트
- 카드 생성 서버 액션 테스트
- 덱 생성 서버 액션 테스트
- 덱 수정 서버 액션 테스트
- 덱 공유 helper 테스트

### Playwright
- 홈 화면 렌더 / 태그 필터
- 카드 상세 페이지 렌더
- 카드/덱 생성 validation
- 덱 수정 초기값 노출
- 카드 생성 / 덱 생성 / 덱 수정 success flow (mock persistence)

---

## 배포
배포는 self-hosted runner + PM2 기준으로 운영합니다.

### 앱 경로
- `/Users/bini/apps/03_voxie`

### 배포용 env 파일
- `/Users/bini/apps/03_voxie/.env.local`

CD 워크플로우는 빌드 전에 이 파일 존재 여부를 검사합니다.
파일이 없으면 배포를 중단해서 env 누락 상태의 배포를 막습니다.

필수 값:
```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

### 중요한 제약
프론트엔드가 Cloudflare Tunnel 뒤에서 서비스되므로,
브라우저가 `localhost:8000`에 직접 붙는 구조를 전제로 하면 안 됩니다.
Supabase 연결은 서버 측 경로 기준으로 유지합니다.

---

## 현재 남은 우선순위
- 실배포 환경에서 카드/덱 저장 동작 최종 검증
- fallback 모드와 Supabase 모드 간 UX 차이 정리
- 남은 seed/helper 의존 경계 정리
- 문서와 실제 구현 상태의 지속적 동기화
- related discovery / onboarding decks / lightweight social loop 확장
