export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string
          slug: string
          title: string
          type: string
          character: string
          tags: string[]
          source_url: string | null
          youtube_url: string | null
          owner_user_id: string | null
          author_handle: string | null
          author_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          type: string
          character: string
          tags?: string[]
          source_url?: string | null
          youtube_url?: string | null
          owner_user_id?: string | null
          author_handle?: string | null
          author_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          type?: string
          character?: string
          tags?: string[]
          source_url?: string | null
          youtube_url?: string | null
          owner_user_id?: string | null
          author_handle?: string | null
          author_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      decks: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          owner_user_id: string | null
          author_handle: string | null
          author_name: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          owner_user_id?: string | null
          author_handle?: string | null
          author_name?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          owner_user_id?: string | null
          author_handle?: string | null
          author_name?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      deck_cards: {
        Row: {
          id: string
          deck_id: string
          card_id: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          card_id: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          card_id?: string
          position?: number
          created_at?: string
        }
      }
      deck_likes: {
        Row: {
          id: string
          deck_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          user_id?: string
          created_at?: string
        }
      }
      deck_bookmarks: {
        Row: {
          id: string
          deck_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          user_id?: string
          created_at?: string
        }
      }
      curator_follows: {
        Row: {
          id: string
          curator_handle: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          curator_handle: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          curator_handle?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
