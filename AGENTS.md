# Voxie — Agents Plan

## 목적
보컬로이드 서브컬쳐 커뮤니티 카드 아카이브 **Voxie**의 MVP를 안정적으로 출시하고,
로컬 seed 기반 MVP에서 **Supabase 기반 운영 모드**로 자연스럽게 전환한다.

## 현재 상태 요약
Voxie는 더 이상 아이디어 단계가 아니라, **MVP 핵심 흐름이 구현된 상태**다.
현재는 아래 두 가지를 동시에 만족하는 과도기 단계로 본다.

1. **로컬 seed fallback으로 기본 기능이 항상 동작함**
2. **Supabase read/write 경로가 이미 도입되어 실제 데이터 저장 구조로 전환 중임**

즉, 현재 프로젝트는:
- 카드/덱 주요 화면 구현 완료
- 기본 테스트 통과
- GitHub Actions CI/CD 연결 완료
- Supabase 스키마 및 클라이언트 구성 완료
- 일부 UI/초기값 로직은 아직 seed 의존성이 남아 있음

---

## 운영 원칙
- 이 문서를 **현재 구현 상태와 운영 방향의 SSOT**로 유지한다.
- 계획보다 **실제 코드 기준**으로 문서를 갱신한다.
- **TDD 우선**: 테스트 → 구현 → 리팩터 순서를 지킨다.
- **브랜치 전략**: `main` 직접 작업 금지, `dev`에서 작업 후 `dev → main` PR로 반영한다.
- PR 머지 전 **CI 통과 확인은 필수**다.
- 머지 전략은 **merge commit**을 기본으로 한다.

---

## 제품 목표
Voxie의 MVP 목표는 다음과 같다.

### 핵심 유저 플로우
1. 유저가 카드를 탐색한다
2. 태그/검색으로 원하는 카드를 찾는다
3. 카드 상세를 확인한다
4. 새 카드를 작성한다
5. 여러 카드를 묶어 덱을 만든다
6. 덱 상세를 보고 공유 가능한 단위로 소비한다
7. 기존 덱을 수정한다

---

## 현재 구현 범위

### 라우트
- `/` 홈 피드 (카드 리스트, 태그 필터, 검색)
- `/cards/[slug]` 카드 상세
- `/cards/new` 카드 작성
- `/decks` 덱 목록, 검색
- `/decks/[slug]` 덱 상세
- `/decks/new` 덱 생성
- `/decks/[slug]/edit` 덱 수정

### 구현 완료 항목
- [x] Next.js App Router 기반 앱 구조
- [x] 터미널 스타일 UI 테마 적용
- [x] 카드 목록 렌더링
- [x] 태그 필터링
- [x] 카드 검색
- [x] 카드 상세 페이지
- [x] 카드 작성 UI
- [x] 덱 목록 페이지
- [x] 덱 검색
- [x] 덱 상세 페이지
- [x] 덱 생성 UI
- [x] 덱 수정 UI
- [x] 로컬 seed 데이터 기반 fallback 동작
- [x] Supabase schema / migration / seed SQL 정리
- [x] Supabase read path 도입
- [x] Supabase write path 도입
- [x] Vitest 기본 테스트 구성
- [x] Playwright E2E 기본 테스트 구성
- [x] GitHub Actions CI 구성
- [x] GitHub Actions CD 구성

---

## 데이터 아키텍처

### 현재 데이터 소스 전략
Voxie는 현재 **dual-source transition** 상태다.

#### A. Fallback 소스
- `src/data/seed.json`
- `src/data/decks.json`

Supabase 환경 변수가 없더라도 앱이 읽기 가능한 상태를 유지한다.

#### B. Primary 운영 소스
- Supabase
  - `cards`
  - `decks`
  - `deck_cards`

환경 변수가 설정되면 read/write는 Supabase 경로를 우선 사용한다.

### 현재 판단
- **읽기 경로**: Supabase 우선 + fallback 지원
- **쓰기 경로**: Supabase 전용
- **초기 UI 일부**: 아직 seed 배열 직접 참조가 남아 있음

---

## Supabase 전환 상태

### 완료
- [x] DB 스키마 정의
- [x] migration 작성
- [x] seed SQL 작성
- [x] 타입 정의 작성
- [x] Supabase client 유틸 구성
- [x] 카드 목록/상세 읽기 연결
- [x] 덱 목록/상세 읽기 연결
- [x] 카드 생성 서버 액션 연결
- [x] 덱 생성 서버 액션 연결
- [x] 덱 수정 서버 액션 연결

### 아직 남은 정리 포인트
- [ ] 생성/수정 UI의 안내 문구를 실제 동작과 일치시키기
- [ ] 카드/덱 생성/수정 플로우 테스트 보강
- [ ] 덱 수정 페이지 초기값을 seed 대신 Supabase 기준으로 일관화할지 결정
- [ ] 카드 선택 목록 등 UI 내부 seed 직접 참조 제거 여부 결정
- [ ] 완전 Supabase 모드에서의 UX 점검

---

## 테스트 전략

### 현재 존재하는 테스트
#### Unit / helper
- 카드 form helper 테스트
- 덱 form helper 테스트
- 덱 edit helper 테스트
- 카드/덱 조회 테스트
- 검색 테스트

#### E2E
- 홈 화면 카드 노출 및 태그 필터 테스트
- 카드 상세 페이지 렌더 테스트

### 테스트 원칙
- 새로운 기능은 가능하면 **테스트 먼저 작성**한다.
- seed fallback 모드와 Supabase 모드가 서로 어긋나지 않게 주의한다.
- 서버 액션이 늘어날수록 성공/실패 케이스 테스트를 추가한다.

### 우선 보강 대상
- [ ] `createCard` 서버 액션 테스트
- [ ] `createDeck` 서버 액션 테스트
- [ ] `updateDeck` 서버 액션 테스트
- [ ] 생성/수정 페이지 사용자 흐름 테스트
- [ ] Supabase 설정 유무에 따른 동작 차이 테스트

---

## CI/CD 운영

### 브랜치 전략
- 장기 브랜치: `main`, `dev`
- 작업은 `dev`에서 진행
- `dev → main` PR 생성 후 병합

### CI
PR 기준으로 다음 검증을 수행한다.
- typecheck
- test

### CD
`main` 반영 후 배포를 수행한다.
- self-hosted runner 기반
- 빌드 전 `.env.local` 존재 여부 검증
- PM2 운영 경로 기준 배포

### 배포 관련 환경
배포 서버 앱 경로:
- `/Users/bini/apps/03_voxie`

배포 env 파일:
- `/Users/bini/apps/03_voxie/.env.local`

필수 환경 변수:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## 코드 품질 규칙
- TypeScript strict 모드 유지
- 커밋 전 typecheck 통과 유지
- Husky pre-commit 훅 유지
- 문서의 상태 설명은 실제 코드와 어긋나지 않게 관리
- 사용자-facing 문구는 실제 기능 상태와 일치해야 함

---

## 현재 리스크 / 주의사항

### 1. 문서-구현 불일치
일부 페이지 문구는 아직
- “저장 대신 유효성만 확인”
처럼 쓰여 있지만,
실제 구현은 Supabase 저장을 시도한다.

### 2. seed / Supabase 혼합 상태
앱 전체가 완전히 DB 단일 소스로 전환된 것은 아니다.
일부 페이지는 여전히 seed 기반 초기값/목록을 사용한다.

### 3. 테스트 범위 편중
현재 테스트는 helper/읽기 흐름에 비해,
쓰기 액션과 편집 흐름 커버리지가 상대적으로 약하다.

---

## 다음 우선순위

### Priority 1 — 문서/UX 정합성
- [ ] AGENTS / README / 화면 문구를 실제 상태와 일치시키기
- [ ] 생성/수정 페이지 안내 문구 수정

### Priority 2 — 쓰기 흐름 안정화
- [ ] create/update 액션 테스트 보강
- [ ] 에러 메시지 및 실패 시 UX 정리

### Priority 3 — 데이터 소스 일관화
- [ ] 덱 수정 페이지의 초기 데이터 소스 정리
- [ ] 카드 선택 목록 seed 의존 축소 또는 제거
- [ ] 완전 Supabase 모드 전환 기준 정의

### Priority 4 — MVP polish
- [ ] empty state 개선
- [ ] not found / error UX 개선
- [ ] SEO/metadata 최소 정리
- [ ] 공유 경험 정리

---

## 범위 밖 (현재 보류)
- 유저 로그인/프로필
- 댓글/리액션
- 추천 알고리즘
- 고급 moderation
- 캐릭터별 테마 스킨

---

## 최근 주요 이력
- 2026-03-11: Next.js 기반 Voxie MVP 구조 구축
- 2026-03-11: 카드/덱 읽기 흐름 구현
- 2026-03-11: Supabase foundation 및 schema 도입
- 2026-03-11: 카드/덱 Supabase read path 연결
- 2026-03-11: 카드 생성 / 덱 생성 / 덱 수정 write path 구현
- 2026-03-11: CI/CD 및 배포 env 검증 흐름 연결
- 2026-03-11: AGENTS.md를 초기 계획 문서에서 현재 상태 기반 운영 문서로 재정리
