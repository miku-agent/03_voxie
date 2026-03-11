# Voxie — Agents Plan

## 목적
보컬로이드 서브컬쳐 커뮤니티 카드 아카이브 **Voxie**의 MVP를 빠르게 출시한다.

## 운영 원칙
- 모든 작업은 이 문서를 **단일 소스 오브 트루스(SSOT)** 로 유지한다.
- 작업 시작 전/후 이 문서를 갱신한다.
- MVP 범위를 벗어나는 기능은 별도 섹션에 기록하고 보류한다.

---

## MVP 목표 (2주)
**카드 공유 + 덱 생성 + 공유 링크**까지 제공한다.

### 핵심 유저 플로우
1. 유저가 카드 작성
2. 카드 피드에서 탐색/필터
3. 카드 상세 확인
4. 카드 5장을 모아 덱 생성
5. 덱 링크 공유

---

## 계획 (Phase)

### Phase 0 — 설계/정렬 (Day 1)
- [ ] 제품 목표/범위 확정 (이 문서)
- [ ] IA 및 화면 목록 정의
- [ ] DB 스키마 초안 확정

### Phase 1 — 기반 구축 (Day 2–3)
- [ ] Next.js(App Router) + Tailwind 초기 셋업
- [ ] Supabase 프로젝트 생성 및 연결
- [ ] 기본 레이아웃/테마 토큰 적용

### Phase 2 — 카드 기능 (Day 4–7)
- [ ] 카드 리스트/필터
- [ ] 카드 상세
- [ ] 카드 작성(폼 + 검증)
- [ ] 시드 데이터 마이그레이션

### Phase 3 — 덱 기능 (Day 8–10)
- [ ] 덱 생성(카드 5장 선택)
- [ ] 덱 상세 + 공유 링크

### Phase 4 — MVP 안정화 (Day 11–14)
- [ ] 기본 SEO/메타 태그
- [ ] 오류/빈 상태 처리
- [ ] 최소 QA 및 배포 체크

---

## 화면 목록 (초안)
- `/` 홈 피드 (카드 리스트)
- `/card/[slug]` 카드 상세
- `/new` 카드 작성
- `/deck/new` 덱 생성
- `/deck/[id]` 덱 상세

---

## 데이터 모델 (초안)
```sql
-- cards
id uuid primary key
slug text unique
title text not null
body text
character text
tags text[]
source_url text
created_at timestamp

-- decks
id uuid primary key
title text not null
card_ids uuid[]
created_at timestamp
```

---

## 범위 밖 (보류)
- 유저 로그인/프로필
- 댓글/리액션
- 캐릭터별 테마 스킨
- 추천 알고리즘

---

## 결정 필요 사항
- 공개 여부(기본 공개?)
- 카드 작성 권한(모든 유저 vs 승인제)
- 초기 태그 텍소노미

---

## 변경 이력
- 2026-03-11: 초기 계획 수립
