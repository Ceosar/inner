import { supabase } from './supabase';
import type { Message } from './supabase';
import { getMentorById, type Mentor } from './mentors';

const SUGGESTIONS: Record<string, string[]> = {
  psychologist: [
    'Help me understand why I feel this way',
    'What patterns do you notice in what I said?',
    'Why do I keep repeating this behavior?',
  ],
  pastor: [
    'Help me find meaning in this situation',
    'I need hope right now',
    'What does purpose look like here?',
  ],
  'rational-friend': [
    'Help me think through this logically',
    'What am I missing in my thinking?',
    'Give me an honest outside perspective',
  ],
  'dream-interpreter': [
    'I had a strange dream last night',
    'What does this symbol mean?',
    'I keep having the same recurring dream',
  ],
  'life-advisor': [
    'I feel stuck in my life',
    'Help me see the bigger picture',
    'What should I prioritize right now?',
  ],
  'shadow-self': [
    'I want to understand a pattern in myself',
    'Why do I react so strongly to this?',
    'What am I avoiding looking at?',
  ],
};

export function getSuggestions(mentorId: string): string[] {
  return (
    SUGGESTIONS[mentorId] ?? [
      'Help me understand my situation',
      'Why do I feel this way?',
      'Give me another perspective',
    ]
  );
}

export async function generateResponse(
  mentors: Mentor[],
  mentorId: string,
  messages: Message[],
  customPrompt: string,
  deepMode: boolean,
): Promise<{ content: string; reasoning_content: string }> {
  const mentor = getMentorById(mentors, mentorId);
  const basePrompt = mentor.base_prompt;

  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: {
      messages,
      systemPrompt: basePrompt,
      customPrompt,
      deepMode,
    },
  });

  if (error) {
    console.error('Edge Function error:', error);
    throw new Error('Не удалось получить ответ от AI');
  }

  return {
    content: (data as any).content || '',
    reasoning_content: (data as any).reasoning_content || '',
  };
}
