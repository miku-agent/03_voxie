# Voxie

보컬로이드 서브컬쳐 커뮤니티 카드 아카이브 (MVP)

## 방향성
- **카드 기반**으로 곡/대사/순간을 공유
- 태그 + 랜덤 피드로 **유입/재방문** 강화
- 덱(카드 5장 모음) 공유로 **커뮤니티 확산**

## MVP 범위
1) 카드 작성 (제목, 텍스트, 캐릭터, 태그, 링크)
2) 카드 피드 + 태그 필터
3) 카드 상세
4) 덱 만들기 + 공유 링크

## 기술 스택 (제안)
- **Next.js (App Router)**
- **Tailwind CSS**
- **Supabase (Auth + DB + Storage)**
- **Zod** (입력 검증)

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

## 시드 데이터
- `data/seed.json` (곡 카드 예시 5개)

## Supabase Setup

### 환경 설정

1. Supabase 프로젝트 생성 (https://supabase.com)
2. `.env.local` 파일 생성 (`.env.example` 참고):
   ```bash
   cp .env.example .env.local
   ```
3. Supabase 프로젝트 설정에서 URL과 Anon Key를 복사하여 `.env.local`에 추가
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - 이 값들은 브라우저 공개용 `NEXT_PUBLIC_*`가 아니라 **Next 서버 전용**으로 사용합니다.

### 데이터베이스 마이그레이션

Supabase SQL Editor에서 다음 파일들을 순서대로 실행:

1. `supabase/migrations/001_initial_schema.sql` - 테이블 및 인덱스 생성
2. `supabase/seed.sql` - (선택사항) 개발용 시드 데이터

### 현재 상태

- **Phase 1 완료**: Supabase 스키마 설계 및 클라이언트 설정
- 기존 로컬 seed 데이터로 앱 동작 유지 (fallback mode)
- Supabase 환경변수가 없어도 앱이 정상 동작

자세한 스키마 설계는 `docs/supabase-schema.md` 참고

## Deployment Env (PM2 / self-hosted runner)

실배포에서는 저장소 안에 env를 커밋하지 않고, **배포 서버 앱 디렉토리**에만 `.env.local`을 둡니다.

배포 경로:
- `/Users/bini/apps/03_voxie/.env.local`

필수 값:
```bash
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key-here
```

CD 워크플로우는 빌드 전에 이 파일 존재 여부를 검사합니다.
파일이 없으면 배포를 중단해서, env 누락 상태로 잘못 배포되는 것을 막습니다.

## 다음 단계
- 초기 UI 와이어프레임
- ~~Supabase 스키마 생성~~ ✅
- 카드 CRUD + 덱 생성 MVP 구현
