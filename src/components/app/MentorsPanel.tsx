import { useState } from 'react';
import type { Mentor } from '../../lib/mentors';

type Props = {
  mentors: Mentor[];
  activeMentorId: string;
  onSelectMentor: (id: string) => void;
};

export default function MentorsPanel({ mentors, activeMentorId, onSelectMentor }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <aside
      className="flex h-screen w-56 shrink-0 flex-col border-l border-white/6"
      style={{
        background: 'rgba(5,9,22,0.98)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="border-b border-white/5 px-5 py-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30">Mentors</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {mentors.map(mentor => {
          const isActive = mentor.id === activeMentorId;
          const isExpanded = expanded === mentor.id;
          return (
            <div key={mentor.id}>
              <div
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${mentor.glow_color}18, ${mentor.glow_color}08)`
                    : 'transparent',
                  border: isActive ? `1px solid ${mentor.glow_color}30` : '1px solid transparent',
                  boxShadow: isActive ? `0 0 15px ${mentor.glow_color}10` : 'none',
                }}
                onClick={() => {
                  onSelectMentor(mentor.id);
                  setExpanded(isExpanded ? null : mentor.id);
                }}
                onMouseEnter={() => !isActive && setExpanded(mentor.id)}
                onMouseLeave={() => !isActive && setExpanded(null)}
              >
                {/* Avatar */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition-all duration-200"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${mentor.glow_color}30, ${mentor.glow_color}15)`
                      : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isActive ? mentor.glow_color + '40' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isActive ? `0 0 12px ${mentor.glow_color}30` : 'none',
                  }}
                >
                  {mentor.icon}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-white/80">{mentor.name}</div>
                  <div
                    className="truncate text-xs font-medium"
                    style={{ color: isActive ? mentor.glow_color : 'rgba(255,255,255,0.35)' }}
                  >
                    {mentor.tag}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div
                    className="h-1.5 w-1.5 shrink-0 rounded-full animate-pulse"
                    style={{ background: mentor.glow_color }}
                  />
                )}
              </div>

              {/* Expanded description */}
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isExpanded ? '80px' : '0px', opacity: isExpanded ? 1 : 0 }}
              >
                <div
                  className="mx-3 mb-1 rounded-xl px-3 py-2.5"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="text-xs leading-relaxed text-white/40">{mentor.short_desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
