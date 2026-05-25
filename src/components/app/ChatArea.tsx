import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Message } from '../../lib/supabase';
import type { Mentor } from '../../lib/mentors';

type Props = {
  messages: Message[];
  mentor: Mentor;
  loading: boolean;
  isTyping: boolean;
};

export default function ChatArea({ messages, mentor, loading, isTyping }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-white/30" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{
            background: `linear-gradient(135deg, ${mentor.glow_color}25, ${mentor.glow_color}10)`,
            border: `1px solid ${mentor.glow_color}30`,
            boxShadow: `0 0 30px ${mentor.glow_color}20`,
          }}
        >
          {mentor.icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{mentor.name}</h3>
        <p className="text-sm text-white/40 max-w-xs">{mentor.full_desc}</p>
        <p className="mt-4 text-xs text-white/25">What's on your mind? I'm here to listen.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id ?? i} message={msg} mentor={mentor} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm"
              style={{
                background: `linear-gradient(135deg, ${mentor.glow_color}25, ${mentor.glow_color}10)`,
                border: `1px solid ${mentor.glow_color}25`,
              }}
            >
              {mentor.icon}
            </div>
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message, mentor }: { message: Message; mentor: Mentor }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-md rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(8,145,178,0.15))',
            border: '1px solid rgba(6,182,212,0.2)',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm"
        style={{
          background: `linear-gradient(135deg, ${mentor.glow_color}25, ${mentor.glow_color}10)`,
          border: `1px solid ${mentor.glow_color}25`,
        }}
      >
        {mentor.icon}
      </div>
      <div className="max-w-2xl">
        {/* 👇 НОВОЕ: Сворачиваемый блок с размышлениями */}
        {message.role === 'assistant' && message.reasoning_content && (
          <details className="mb-2 cursor-pointer group">
            <summary className="flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-purple-200 transition-colors">
              <span>🧠</span>
              Show thinking process
            </summary>
            <div className="mt-2 rounded-lg bg-purple-900/20 p-3 text-xs text-purple-200 border border-purple-500/20 max-h-48 overflow-y-auto">
              {message.reasoning_content}
            </div>
          </details>
        )}

        {/* Основное сообщение */}
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-white/85"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {message.content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < message.content.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-white/40"
          style={{
            animation: 'bounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
