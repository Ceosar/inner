import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Zap } from 'lucide-react';
import { getSuggestions } from '../../lib/ai';

type Props = {
  onSend: (message: string) => void;
  disabled: boolean;
  mentorId: string;
  deepMode: boolean;
  onToggleDeepMode: () => void;
  glowColor: string;
};

export default function ChatInput({
  onSend,
  disabled,
  mentorId,
  deepMode,
  onToggleDeepMode,
  glowColor,
}: Props) {
  const [input, setInput] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestions = getSuggestions(mentorId);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || disabled) return;
    setInput('');
    onSend(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (s: string) => {
    setInput(s);
    textareaRef.current?.focus();
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mx-auto max-w-2xl">
        {/* Suggestion chips */}
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input container */}
        <div
          className="relative rounded-2xl border transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderColor: input ? `${glowColor}40` : 'rgba(255,255,255,0.1)',
            boxShadow: input ? `0 0 20px ${glowColor}10` : 'none',
          }}
        >
          {/* Deep mode toggle */}
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2">
            <button
              onClick={onToggleDeepMode}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all hover:scale-105"
              style={{
                background: deepMode ? `${glowColor}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${deepMode ? glowColor + '40' : 'rgba(255,255,255,0.08)'}`,
                color: deepMode ? glowColor : 'rgba(255,255,255,0.35)',
              }}
            >
              <Zap size={11} className={deepMode ? 'animate-pulse' : ''} />
              Deep Thinking
            </button>
            {deepMode && (
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                More analytical, structured responses
              </span>
            )}
          </div>

          {/* Textarea */}
          <div className="flex items-end gap-2 px-4 py-3">
            <button className="mb-0.5 shrink-0 text-white/30 transition-colors hover:text-white/60">
              <Paperclip size={18} />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); adjustHeight(); }}
              onKeyDown={handleKeyDown}
              placeholder="Write what's on your mind..."
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-white placeholder-white/30 outline-none"
              style={{ lineHeight: '1.6', minHeight: '24px', maxHeight: '160px' }}
            />

            <div className="flex shrink-0 items-center gap-1.5 mb-0.5">
              <button
                onClick={() => setIsMicActive(!isMicActive)}
                className="text-white/30 transition-colors hover:text-white/60"
                style={{ color: isMicActive ? glowColor : undefined }}
              >
                <Mic size={18} className={isMicActive ? 'animate-pulse' : ''} />
              </button>

              <button
                onClick={handleSend}
                disabled={!input.trim() || disabled}
                className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-90 disabled:opacity-30"
                style={{
                  background: input.trim() ? `linear-gradient(135deg, ${glowColor}, ${glowColor}cc)` : 'rgba(255,255,255,0.1)',
                  boxShadow: input.trim() ? `0 0 12px ${glowColor}40` : 'none',
                }}
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-white/15">
          InnerGuide AI · Not a substitute for professional help
        </p>
      </div>
    </div>
  );
}
