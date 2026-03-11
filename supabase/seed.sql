-- Seed data for development
-- This file can be run to populate the database with initial data

-- Insert sample cards (matching existing seed.json structure)
INSERT INTO cards (slug, title, type, character, tags, source_url, youtube_url) VALUES
  ('melt', 'Melt', 'song', 'Hatsune Miku', ARRAY['classic', 'romance', '2007'], 'https://mikudb.moe/classic-miku-songs/', 'https://www.youtube.com/watch?v=o1jAMSQyVPc'),
  ('world-is-mine', 'World is Mine', 'song', 'Hatsune Miku', ARRAY['classic', 'iconic'], 'https://mikudb.moe/classic-miku-songs/', NULL),
  ('rolling-girl', 'Rolling Girl', 'song', 'Hatsune Miku', ARRAY['emotional', 'wowaka'], NULL, 'https://youtu.be/vnw8zURAxkU'),
  ('ievan-polkka', 'Ievan Polkka', 'song', 'Hatsune Miku', ARRAY['meme', 'classic'], NULL, NULL),
  ('reverse-rainbow', 'Reverse Rainbow', 'song', 'Rin & Len', ARRAY['duet', 'emotional'], NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample decks
INSERT INTO decks (slug, name, description, tags) VALUES
  ('classic-miku', 'Classic Miku', '초기 대표곡 모음', ARRAY['classic', 'miku']),
  ('stage-hits', 'Stage Hits', '라이브에서 많이 불린 곡', ARRAY['iconic', 'live'])
ON CONFLICT (slug) DO NOTHING;

-- Link cards to decks (we need to use subqueries to get the IDs)
-- Classic Miku deck
INSERT INTO deck_cards (deck_id, card_id, position)
SELECT
  d.id,
  c.id,
  row_number() OVER (ORDER BY
    CASE c.slug
      WHEN 'melt' THEN 1
      WHEN 'world-is-mine' THEN 2
      WHEN 'rolling-girl' THEN 3
    END
  ) as position
FROM decks d
CROSS JOIN cards c
WHERE d.slug = 'classic-miku'
  AND c.slug IN ('melt', 'world-is-mine', 'rolling-girl')
ON CONFLICT (deck_id, card_id) DO NOTHING;

-- Stage Hits deck
INSERT INTO deck_cards (deck_id, card_id, position)
SELECT
  d.id,
  c.id,
  row_number() OVER (ORDER BY
    CASE c.slug
      WHEN 'melt' THEN 1
      WHEN 'ievan-polkka' THEN 2
      WHEN 'reverse-rainbow' THEN 3
    END
  ) as position
FROM decks d
CROSS JOIN cards c
WHERE d.slug = 'stage-hits'
  AND c.slug IN ('melt', 'ievan-polkka', 'reverse-rainbow')
ON CONFLICT (deck_id, card_id) DO NOTHING;