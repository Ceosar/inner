import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const DEEP_MODE_SUFFIX = `\n\nIMPORTANT: The user has enabled Deep Thinking mode. Provide responses that are:
- Longer and more thorough
- Structured with clear sections when appropriate
- More analytical and multi-dimensional
- Include multiple perspectives or frameworks
- Surface deeper patterns and implications`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async req => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, customPrompt, deepMode } = await req.json();

    // Фильтруем невалидные сообщения
    const validMessages = (Array.isArray(messages) ? messages : []).filter(
      (msg: any) => msg && typeof msg.role === 'string' && typeof msg.content === 'string',
    );

    // Собираем финальный системный промпт
    let fullSystemPrompt = systemPrompt || '';
    if (customPrompt) fullSystemPrompt += `\n\nAdditional instructions: ${customPrompt}`;
    if (deepMode) fullSystemPrompt += DEEP_MODE_SUFFIX;

    const apiMessages = [
      { role: 'system', content: fullSystemPrompt },
      ...validMessages.map((msg: any) => ({ role: msg.role, content: msg.content })),
    ];

    // Основной запрос к DeepSeek
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        messages: apiMessages,
        reasoning_effort: 'high',
        extra_body: {
          thinking: { type: 'enabled' },
        },
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `DeepSeek API error ${response.status}: ${errorText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    const assistantContent = message?.content ?? '';
    const reasoningContent = message?.reasoning_content ?? '';

    return new Response(
      JSON.stringify({ content: assistantContent, reasoning_content: reasoningContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Edge Function error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
