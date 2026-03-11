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

## 다음 단계
- 초기 UI 와이어프레임
- Supabase 스키마 생성
- 카드 CRUD + 덱 생성 MVP 구현
