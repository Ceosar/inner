import { useState } from 'react';
import { X, RotateCcw, Shield } from 'lucide-react';
import type { Mentor } from '../../lib/mentors';

type Props = {
  mentor: Mentor;
  customPrompt: string;
  strictMode: boolean;
  onCustomPromptChange: (v: string) => void;
  onStrictModeChange: (v: boolean) => void;
  onReset: () => void;
  onClose: () => void;
};

export default function MentorSettingsPanel({
  mentor,
  customPrompt,
  strictMode,
  onCustomPromptChange,
  onStrictModeChange,
  onReset,
  onClose,
}: Props) {
  const [localPrompt, setLocalPrompt] = useState(customPrompt);

  const handleSave = () => {
    onCustomPromptChange(localPrompt);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 p-6"
        style={{
          background: 'rgba(8,12,28,0.98)',
          boxShadow: `0 0 60px ${mentor.glow_color}15, 0 25px 50px rgba(0,0,0,0.5)`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 hover:text-white/70"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
            style={{
              background: `linear-gradient(135deg, ${mentor.glow_color}25, ${mentor.glow_color}10)`,
              border: `1px solid ${mentor.glow_color}30`,
            }}
          >
            {mentor.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{mentor.name} Settings</h3>
            <p className="text-xs text-white/40">{mentor.tag}</p>
          </div>
        </div>

        {/* Base prompt preview */}
        {/* <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-white/50">Base Personality</label>
          <div
            className="rounded-xl border border-white/6 px-3 py-2.5 text-xs leading-relaxed text-white/30"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            {mentor.base_prompt.slice(0, 120)}...
          </div>
        </div> */}

        {/* Custom prompt */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            Additional Instructions
          </label>
          <textarea
            value={localPrompt}
            onChange={e => setLocalPrompt(e.target.value)}
            placeholder={`e.g. "Focus on practical advice. Keep responses short. Challenge me more."`}
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-white/25 outline-none transition-all focus:border-white/20"
          />
        </div>

        {/* Strict mode toggle */}
        {/* <div
          className="mb-6 flex items-center justify-between rounded-xl border border-white/8 px-3 py-3"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-white/40" />
            <div>
              <div className="text-xs font-medium text-white/70">Strict Mode</div>
              <div className="text-xs text-white/35">AI must not deviate from the prompt</div>
            </div>
          </div>
          <button
            onClick={() => onStrictModeChange(!strictMode)}
            className="relative h-5 w-9 rounded-full transition-all"
            style={{
              background: strictMode ? mentor.glow_color : 'rgba(255,255,255,0.15)',
              boxShadow: strictMode ? `0 0 8px ${mentor.glow_color}50` : 'none',
            }}
          >
            <div
              className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all"
              style={{ left: strictMode ? 'calc(100% - 18px)' : '2px' }}
            />
          </button>
        </div> */}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              onReset();
              setLocalPrompt('');
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-white/50 transition-colors hover:border-white/20 hover:text-white/70"
          >
            <RotateCcw size={12} />
            Reset to default
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl py-2.5 text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${mentor.glow_color}, ${mentor.glow_color}cc)`,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
