import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Conversation = {
  id: string;
  user_id: string;
  mentor_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type UserSettings = {
  id: string;
  custom_prompts: Record<string, string>;
  deep_mode: boolean;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};
