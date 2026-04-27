import { useState } from 'react';
import { Plus, MessageSquare, Settings, LogOut, Trash2 } from 'lucide-react';
import type { Conversation } from '../../lib/supabase';
import { getMentorById } from '../../lib/mentors';

type Props = {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onSettings: () => void;
  onSignOut: () => void;
  userEmail: string;
};

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onSettings,
  onSignOut,
  userEmail,
}: Props) {
  const [hoveredDel, setHoveredDel] = useState<string | null>(null);

  return (
    <aside
      className="flex h-screen w-64 shrink-0 flex-col border-r border-white/6"
      style={{
        background: 'linear-gradient(180deg, rgba(5,9,22,0.98) 0%, rgba(8,12,28,0.98) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg text-base"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0e7490)' }}
        >
          ✦
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">InnerGuide</span>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(8,145,178,0.08))',
            border: '1px solid rgba(6,182,212,0.2)',
            color: '#06b6d4',
          }}
        >
          <Plus size={16} />
          New conversation
        </button>
      </div>

      {/* Conversation history */}
      <div className="mt-4 flex-1 overflow-y-auto px-3 pb-2">
        {conversations.length === 0 ? (
          <div className="px-2 py-8 text-center text-xs text-white/25">
            No conversations yet.
            <br />Start a new chat above.
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-white/25">Recent</div>
            {conversations.map((conv) => {
              const mentor = getMentorById(conv.mentor_id);
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  className="group relative flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all"
                  style={{
                    background: isActive ? 'rgba(6,182,212,0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(6,182,212,0.15)' : '1px solid transparent',
                  }}
                  onClick={() => onSelectConversation(conv.id)}
                  onMouseEnter={() => setHoveredDel(conv.id)}
                  onMouseLeave={() => setHoveredDel(null)}
                >
                  <span className="shrink-0 text-base">{mentor.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-white/75">{conv.title}</div>
                    <div className="text-xs text-white/30">{mentor.tag}</div>
                  </div>
                  {hoveredDel === conv.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                      className="shrink-0 rounded p-0.5 text-white/30 transition-colors hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="border-t border-white/5 px-3 py-3 space-y-0.5">
        <button
          onClick={onSettings}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <Settings size={15} />
          Settings
        </button>
        <div
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
            {userEmail[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-white/50">{userEmail}</div>
          </div>
          <button
            onClick={onSignOut}
            className="shrink-0 text-white/30 transition-colors hover:text-white/70"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
