# Voxie — Agents Guide

## 목적
Voxie는 보컬로이드 서브컬쳐 커뮤니티 카드 아카이브 MVP다.
현재 목표는 **seed fallback을 유지하면서 Supabase 운영 모드로 안정적으로 전환**하고,
실제 구현 상태와 운영 문서를 계속 일치시키는 것이다.

---

## 현재 상태 요약
Voxie는 아이디어 단계가 아니라, **핵심 사용자 흐름이 이미 구현된 MVP**다.
현재 앱은 다음 두 가지를 동시에 만족한다.

1. **Supabase 환경 변수가 없어도 local seed fallback으로 동작한다**
2. **Supabase가 설정되면 카드/덱 read/write를 실제 DB 경로로 처리한다**

즉, 현재는 완전한 DB-only 단계가 아니라,
**fallback-safe MVP + Supabase 전환 마무리 단계**로 보는 것이 정확하다.

---

## 운영 원칙
- 이 문서는 **계획 문서가 아니라 현재 구현 상태의 SSOT**로 유지한다.
- 계획보다 **실제 코드와 최근 PR 상태**를 우선한다.
- **TDD 우선**: 테스트 → 구현 → 리팩터 순서를 지킨다.
- **브랜치 전략**: `main` 직접 작업 금지, `dev`에서 작업 후 `dev → main` PR로 반영한다.
- PR 머지 전 **GitHub Actions CI 성공 확인은 필수**다.
- PR 머지는 기본적으로 **merge commit**을 사용한다.
- 머지 후에는 반드시 `dev`를 `main` 기준으로 다시 동기화한다.

---

## 핵심 사용자 플로우
1. 홈에서 카드를 탐색한다
2. 태그/검색으로 카드를 찾는다
3. 카드 상세를 본다
4. 새 카드를 작성한다
5. 여러 카드를 묶어 덱을 만든다
6. 덱 목록/상세를 탐색한다
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
- [x] 로컬 seed fallback 동작
- [x] Supabase schema / migration / seed SQL 정리
- [x] Supabase read path 도입
- [x] Supabase write path 도입
- [x] 카드 생성 / 덱 생성 / 덱 수정 서버 액션 연결
- [x] create/edit 페이지 저장 안내 문구 실제 동작과 정렬
- [x] 덱 수정 페이지를 async 데이터 소스 기반으로 정리
- [x] 덱 생성 페이지를 server fetch + client form 구조로 정리
- [x] Vitest 기본 테스트 구성
- [x] Playwright E2E 기본 테스트 구성
- [x] GitHub Actions CI 구성
- [x] GitHub Actions CD 구성
- [x] 배포 전 `.env.local` 존재 검증 추가

---

## 데이터 아키텍처

### 현재 데이터 소스 전략
Voxie는 현재 **dual-source transition** 상태다.

#### Fallback 소스
- `src/data/seed.json`
- `src/data/decks.json`

Supabase 환경 변수가 없어도 앱의 읽기 흐름이 유지된다.

#### Primary 운영 소스
- Supabase
  - `cards`
  - `decks`
  - `deck_cards`

환경 변수가 설정되면 read/write는 Supabase 경로를 우선 사용한다.

### 현재 판단
- **읽기 경로**: Supabase 우선 + fallback 지원
- **쓰기 경로**: 운영 모드에서는 Supabase, Playwright 테스트에서는 mock persistence 지원
- **상세/목록 페이지**: async read path 사용 중
- **덱 생성/수정 페이지**: server fetch + client form 패턴으로 정리됨
- **일부 helper / fallback 로직**: seed 데이터를 여전히 기준값으로 사용
- **성공 저장 E2E**: 실제 Supabase 대신 mock-backed write-through store로 안정적으로 검증 가능

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
- [x] 카드 생성 서버 액션 테스트 추가
- [x] 덱 생성 서버 액션 테스트 추가
- [x] 덱 수정 서버 액션 테스트 추가

### 아직 남은 정리 포인트
- [ ] `/cards/new`를 포함한 create UI 구조 정렬 여부 결정
- [ ] 생성/수정 흐름 사용자 경험 개선 (성공/실패/empty state)
- [ ] 완전 Supabase 모드에서 실배포 저장 동작 검증
- [ ] seed 의존 helper를 어디까지 유지할지 기준 확정
- [ ] Playwright mock persistence를 테스트 전용 경계로 얼마나 공식화할지 결정

---

## 테스트 전략

### 현재 존재하는 테스트
#### Unit / helper / action
- 카드 form helper 테스트
- 덱 form helper 테스트
- 덱 edit helper 테스트
- 카드/덱 조회 테스트
- 검색 테스트
- 카드 생성 서버 액션 테스트
- 덱 생성 서버 액션 테스트
- 덱 수정 서버 액션 테스트

#### E2E
- 홈 화면 카드 노출 및 태그 필터 테스트
- 카드 상세 페이지 렌더 테스트
- 카드 생성 validation 테스트
- 덱 생성 validation 테스트
- 덱 수정 초기값 노출 테스트
- 카드 생성 성공 후 홈 반영 테스트 (mock persistence)
- 덱 생성 성공 후 상세 반영 테스트 (mock persistence)
- 덱 수정 성공 후 상세 반영 테스트 (mock persistence)

### 테스트 원칙
- 새로운 기능은 가능하면 **테스트 먼저 작성**한다.
- fallback 모드와 Supabase 모드가 서로 어긋나지 않게 주의한다.
- 서버 액션이 늘어날수록 성공/실패 케이스를 같이 검증한다.

### 다음 보강 후보
- [ ] 실 Supabase 환경 기준 성공 저장 E2E 또는 smoke test
- [ ] Supabase 설정 유무에 따른 UI 차이 테스트
- [ ] 서버 액션 에러 메시지 UX 테스트

---

## CI/CD 운영

### 브랜치 전략
- 장기 브랜치: `main`, `dev`
- 작업은 `dev`에서 진행
- `dev → main` PR 생성 후 병합

### CI
PR 기준으로 다음 검증을 수행한다.
- `pnpm typecheck`
- `pnpm test`

### CD
`main` 반영 후 배포를 수행한다.
- self-hosted runner 기반
- 빌드 전 `/Users/bini/apps/03_voxie/.env.local` 존재 여부 검증
- env 누락 시 배포 중단
- PM2 운영 경로 기준 배포

### 배포 관련 환경
배포 서버 앱 경로:
- `/Users/bini/apps/03_voxie`

배포 env 파일:
- `/Users/bini/apps/03_voxie/.env.local`

필수 환경 변수:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 중요한 제약
- 프론트엔드가 Cloudflare Tunnel 뒤에서 서비스되므로,
  브라우저가 `localhost:8000`에 직접 붙는 구조를 전제로 하면 안 된다.
- Supabase 연결은 현재처럼 **Next 서버 측 경로 기준**으로 유지한다.

---

## 현재 리스크 / 주의사항

### 1. 문서 드리프트
README와 실제 구현 상태가 완전히 동일하지 않을 수 있다.
특히 “Phase 1 완료” 같은 표현은 현재 구현보다 뒤처질 수 있으니,
변경 시 문서도 같이 갱신한다.

### 2. seed / Supabase 혼합 상태
앱 전체가 완전히 DB 단일 소스로 전환된 것은 아니다.
현재는 fallback 안정성을 유지하기 위해 일부 helper가 seed를 기반값으로 사용한다.

### 3. 실배포 검증 부족
로컬 테스트와 CI는 안정적이지만,
실제 배포 환경에서 카드/덱 저장이 기대대로 동작하는지에 대한 최종 확인은 더 필요하다.

---

## 다음 우선순위

### Priority 1 — 실동작 검증
- [ ] 배포 환경에서 카드 생성 저장 확인
- [ ] 배포 환경에서 덱 생성/수정 저장 확인
- [ ] 저장 후 목록/상세 revalidation UX 확인

### Priority 2 — 데이터 소스 일관화
- [ ] `/cards/new` 구조를 다른 create/edit 페이지와 맞출지 결정
- [ ] seed 직접 참조/helper 의존을 어디까지 유지할지 정리
- [ ] fallback-safe 구조와 DB-first 구조의 경계 문서화

### Priority 3 — UX polish
- [ ] not found / empty state 개선
- [ ] 저장 성공 후 피드백 개선
- [ ] 에러 메시지 톤/정확도 개선

### Priority 4 — 문서 정합성
- [ ] README를 현재 구현 수준에 맞게 갱신
- [ ] 운영/배포 메모를 AGENTS와 README 사이에서 중복 없이 정리

---

## 범위 밖 (현재 보류)
- 유저 로그인/프로필
- 댓글/리액션
- 추천 알고리즘
- 고급 moderation
- 캐릭터별 테마 스킨

---

## 최근 주요 이력
- 2026-03-11: Supabase foundation 및 schema 도입
- 2026-03-11: 카드/덱 Supabase read path 연결
- 2026-03-11: 카드 생성 / 덱 생성 / 덱 수정 write path 구현
- 2026-03-11: 배포 전 env 검증 추가
- 2026-03-11: 생성/수정 페이지 문구를 실제 저장 흐름에 맞게 정리
- 2026-03-11: 덱 수정 페이지를 async 데이터 소스 기반으로 리팩터
- 2026-03-11: 카드/덱 write action 테스트 추가
- 2026-03-11: 덱 생성 페이지를 async 데이터 로딩 구조로 리팩터
- 2026-03-11: write failure E2E 추가
- 2026-03-11: Playwright 전용 mock persistence 도입
- 2026-03-11: 카드 생성 / 덱 생성 / 덱 수정 success E2E 추가
- 2026-03-11: AGENTS.md를 현재 상태 기준 운영 문서로 재정리
