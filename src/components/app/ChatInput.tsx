import { useState } from 'react';
import { Send, Zap } from 'lucide-react';

type Props = {
  onSend: (content: string) => void;
  disabled: boolean;
  deepMode: boolean;
  onToggleDeepMode: () => void;
  glowColor: string;
};

export default function ChatInput({
  onSend,
  disabled,
  deepMode,
  onToggleDeepMode,
  glowColor,
}: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/5 p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDeepMode}
          className={`p-2 rounded-lg transition-all ${deepMode ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/30 hover:text-white/60'}`}
          style={deepMode ? { borderColor: glowColor } : {}}
        >
          <Zap size={16} />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none border border-white/10 focus:border-white/20 transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
