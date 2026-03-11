# Supabase Database Schema Design

## Overview
This document outlines the database schema for the Voxie MVP using Supabase (PostgreSQL).

## Tables

### 1. cards
Stores individual card information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| slug | text | UNIQUE, NOT NULL | URL-friendly identifier |
| title | text | NOT NULL | Card title |
| type | text | NOT NULL | Card type (e.g., 'song') |
| character | text | NOT NULL | Associated character |
| tags | text[] | DEFAULT '{}' | Array of tags |
| source_url | text | | Optional source URL |
| created_at | timestamptz | DEFAULT NOW() | Creation timestamp |
| updated_at | timestamptz | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_cards_slug` on (slug)
- `idx_cards_tags` on (tags) using GIN
- `idx_cards_character` on (character)

### 2. decks
Stores deck collections.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| slug | text | UNIQUE, NOT NULL | URL-friendly identifier |
| name | text | NOT NULL | Deck name |
| description | text | | Optional description |
| tags | text[] | DEFAULT '{}' | Array of tags |
| created_at | timestamptz | DEFAULT NOW() | Creation timestamp |
| updated_at | timestamptz | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_decks_slug` on (slug)
- `idx_decks_tags` on (tags) using GIN

### 3. deck_cards
Junction table for many-to-many relationship between decks and cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| deck_id | uuid | NOT NULL, REFERENCES decks(id) ON DELETE CASCADE | Deck reference |
| card_id | uuid | NOT NULL, REFERENCES cards(id) ON DELETE CASCADE | Card reference |
| position | integer | NOT NULL | Order of card in deck |
| created_at | timestamptz | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_deck_cards_deck_id` on (deck_id)
- `idx_deck_cards_card_id` on (card_id)
- `idx_deck_cards_position` on (deck_id, position)

**Constraints:**
- UNIQUE(deck_id, card_id) - Prevent duplicate cards in a deck
- UNIQUE(deck_id, position) - Ensure unique positions within a deck

## Row Level Security (RLS)

Initially, we'll set up basic RLS policies for read access:

```sql
-- Enable RLS on all tables
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for MVP)
CREATE POLICY "Allow public read access" ON cards FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON decks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON deck_cards FOR SELECT USING (true);
```

## Migration Strategy

1. **Phase 1 (Current)**: Set up schema and client utilities without breaking existing seed data functionality
2. **Phase 2**: Implement data seeding scripts to populate Supabase from existing JSON seed files
3. **Phase 3**: Gradually migrate read operations to use Supabase
4. **Phase 4**: Implement write operations through Supabase
5. **Phase 5**: Remove local seed data dependency

## Type Definitions

The TypeScript types will be generated from the database schema using Supabase's type generation utilities. For now, we'll maintain compatibility with existing types while preparing for the transition.