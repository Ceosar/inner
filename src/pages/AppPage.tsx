import { useState, useEffect, useCallback } from 'react';
import { Shield, SlidersHorizontal, Menu, Users, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Conversation, Message } from '../lib/supabase';
import { Mentor, getMentorById } from '../lib/mentors';
import { generateResponse } from '../lib/ai';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/app/Sidebar';
import MentorsPanel from '../components/app/MentorsPanel';
import ChatArea from '../components/app/ChatArea';
import ChatInput from '../components/app/ChatInput';
import MentorSettingsPanel from '../components/app/MentorSettingsPanel';
import AdminMentorPanel from '../components/app/AdminMentorPanel';

// --- вспомогательные функции для симуляции печати ---
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateTyping(text: string, onUpdate: (partial: string) => void, speedMs = 15) {
  for (let i = 0; i < text.length; i++) {
    onUpdate(text.slice(0, i + 1));
    await sleep(speedMs);
  }
}
// -------------------------------------------------

export default function AppPage() {
  const { user, signOut } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMentorId, setActiveMentorId] = useState('psychologist');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [deepMode, setDeepMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [strictMode, setStrictMode] = useState(false);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileMentorsOpen, setMobileMentorsOpen] = useState(false);

  // Загрузка менторов
  useEffect(() => {
    if (!user) {
      setLoadingMentors(false);
      return;
    }
    supabase
      .from('mentors')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMentors(data as Mentor[]);
          if (!data.find((m: any) => m.id === activeMentorId)) {
            setActiveMentorId(data[0].id);
          }
        }
        setLoadingMentors(false);
      })
      .catch(() => setLoadingMentors(false));
  }, [user]);

  const activeMentor = mentors.length > 0 ? getMentorById(mentors, activeMentorId) : null;

  // Загрузка бесед
  useEffect(() => {
    if (!user) return;
    supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        if (data) setConversations(data as Conversation[]);
      });
  }, [user]);

  // Загрузка сообщений
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', activeConvId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[]);
        setLoadingMessages(false);
      });
  }, [activeConvId]);

  // Загрузка настроек пользователя: роль из profiles, остальное из user_settings
  useEffect(() => {
    if (!user) return;
    // Роль из profiles
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setRole(data.role ?? 'user');
      });
    // Настройки из user_settings
    supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCustomPrompts((data.custom_prompts as Record<string, string>) ?? {});
          setDeepMode(data.deep_mode ?? false);
        }
      });
  }, [user]);

  const saveSettings = useCallback(
    async (prompts: Record<string, string>, dm: boolean) => {
      if (!user) return;
      await supabase.from('user_settings').upsert({
        id: user.id,
        custom_prompts: prompts,
        deep_mode: dm,
        updated_at: new Date().toISOString(),
      });
    },
    [user],
  );

  const createConversation = async (mentorId: string): Promise<string> => {
    if (!user || !activeMentor) return '';
    const mentor = getMentorById(mentors, mentorId);
    const { data } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, mentor_id: mentorId, title: `Chat with ${mentor.name}` })
      .select()
      .single();
    if (data) {
      const conv = data as Conversation;
      setConversations(prev => [conv, ...prev]);
      return conv.id;
    }
    return '';
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) setActiveMentorId(conv.mentor_id);
    setActiveConvId(id);
  };

  const handleDeleteConversation = async (id: string) => {
    await supabase.from('conversations').delete().eq('id', id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const handleSelectMentor = (id: string) => {
    setActiveMentorId(id);
    setActiveConvId(null);
    setMessages([]);
  };

  // ============== НОВАЯ ОТПРАВКА С ИМИТАЦИЕЙ ПЕЧАТИ ==============
  const handleSendMessage = async (content: string) => {
    setIsTyping(true);
    if (!user || !activeMentor) return;

    let convId = activeConvId;
    if (!convId) {
      convId = await createConversation(activeMentorId);
      if (!convId) return;
      setActiveConvId(convId);
    }

    const userMsg: Omit<Message, 'id' | 'created_at'> = {
      conversation_id: convId,
      role: 'user',
      content,
    };
    const { data: insertedUser } = await supabase
      .from('messages')
      .insert(userMsg)
      .select()
      .single();

    const userMessage = insertedUser as Message;
    setMessages(prev => [...prev, userMessage]);

    if (messages.length === 0) {
      const title = content.length > 50 ? content.slice(0, 50) + '...' : content;
      await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', convId);
      setConversations(prev => prev.map(c => (c.id === convId ? { ...c, title } : c)));
    } else {
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', convId);
    }

    try {
      const allMessages = [...messages, userMessage];
      const response = await generateResponse(
        mentors,
        activeMentorId,
        allMessages,
        customPrompts[activeMentorId] ?? '',
        deepMode,
      );

      setIsTyping(false);

      const tempId = 'streaming-' + crypto.randomUUID();
      const tempMsg: Message = {
        id: tempId,
        conversation_id: convId,
        role: 'assistant',
        content: '',
        reasoning_content: '',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempMsg]);

      const updateTemp = (updates: Partial<Pick<Message, 'content' | 'reasoning_content'>>) => {
        setMessages(prev => prev.map(m => (m.id === tempId ? { ...m, ...updates } : m)));
      };

      if (response.reasoning_content) {
        await simulateTyping(
          response.reasoning_content,
          partial => {
            updateTemp({ reasoning_content: partial });
          },
          10,
        );
      }

      if (response.content) {
        await simulateTyping(
          response.content,
          partial => {
            updateTemp({ content: partial });
          },
          20,
        );
      }

      const { data: insertedAI } = await supabase
        .from('messages')
        .insert({
          conversation_id: convId,
          role: 'assistant',
          content: response.content,
          reasoning_content: response.reasoning_content,
        })
        .select()
        .single();

      if (insertedAI) {
        setMessages(prev => prev.map(m => (m.id === tempId ? (insertedAI as Message) : m)));
      }
    } catch (err) {
      console.error('AI generation error:', err);
      setIsTyping(false);
      setMessages(prev => prev.filter(m => !m.id.startsWith('streaming-')));
    } finally {
      setIsTyping(false);
    }
  };
  // =============================================================

  const handleCustomPromptChange = async (prompt: string) => {
    const next = { ...customPrompts, [activeMentorId]: prompt };
    setCustomPrompts(next);
    await saveSettings(next, deepMode);
  };

  const handleToggleDeepMode = async () => {
    const next = !deepMode;
    setDeepMode(next);
    await saveSettings(customPrompts, next);
  };

  const handleMentorsUpdated = () => {
    supabase
      .from('mentors')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setMentors(data as Mentor[]);
      });
  };

  if (loadingMentors) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#030a18' }}>
        <div className="text-cyan-400 animate-pulse">Loading mentors...</div>
      </div>
    );
  }

  if (!activeMentor) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#030a18' }}>
        <div className="text-red-400">No mentors available. Please contact admin.</div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #030a18 0%, #050d1e 60%, #04091a 100%)`,
      }}
    >
      <div className="hidden md:block">
        <Sidebar
          mentors={mentors}
          conversations={conversations}
          activeConversationId={activeConvId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onSettings={() => setShowSettings(true)}
          onSignOut={signOut}
          userEmail={user?.email ?? ''}
        />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar
              mentors={mentors}
              conversations={conversations}
              activeConversationId={activeConvId}
              onNewChat={handleNewChat}
              onSelectConversation={id => {
                handleSelectConversation(id);
                setMobileSidebarOpen(false);
              }}
              onDeleteConversation={handleDeleteConversation}
              onSettings={() => {
                setShowSettings(true);
                setMobileSidebarOpen(false);
              }}
              onSignOut={signOut}
              userEmail={user?.email ?? ''}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}
      <main className="flex flex-1 flex-col overflow-hidden">
        <div
          className="flex items-center justify-between border-b border-white/5 px-4 py-3 md:px-6 md:py-4"
          style={{
            background: 'rgba(5,10,22,0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden text-white/60 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                style={{
                  background: `linear-gradient(135deg, ${activeMentor.glow_color}25, ${activeMentor.glow_color}10)`,
                  border: `1px solid ${activeMentor.glow_color}30`,
                }}
              >
                {activeMentor.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{activeMentor.name}</div>
                <div className="text-xs" style={{ color: activeMentor.glow_color }}>
                  {activeMentor.tag}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-400 transition-all hover:bg-cyan-500/20"
              >
                <Shield size={13} />
                <span className="hidden sm:inline">Manage Mentors</span>
              </button>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 rounded-xl border border-white/8 px-3 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/15 hover:text-white/80"
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">Customize</span>
            </button>
            <button
              onClick={() => setMobileMentorsOpen(true)}
              className="md:hidden text-white/60 hover:text-white"
            >
              <Users size={20} />
            </button>
          </div>
        </div>
        <ChatArea
          messages={messages}
          mentor={activeMentor}
          loading={loadingMessages}
          isTyping={isTyping}
        />
        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
          mentorId={activeMentorId}
          deepMode={deepMode}
          onToggleDeepMode={handleToggleDeepMode}
          glowColor={activeMentor.glow_color}
        />
      </main>
      <div className="hidden md:block">
        <MentorsPanel
          mentors={mentors}
          activeMentorId={activeMentorId}
          onSelectMentor={handleSelectMentor}
        />
      </div>
      {mobileMentorsOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMentorsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-56">
            <MentorsPanel
              mentors={mentors}
              activeMentorId={activeMentorId}
              onSelectMentor={id => {
                handleSelectMentor(id);
                setMobileMentorsOpen(false);
              }}
              onClose={() => setMobileMentorsOpen(false)}
            />
          </div>
        </div>
      )}
      {showSettings && activeMentor && (
        <MentorSettingsPanel
          mentor={activeMentor}
          customPrompt={customPrompts[activeMentorId] ?? ''}
          strictMode={strictMode}
          onCustomPromptChange={handleCustomPromptChange}
          onStrictModeChange={setStrictMode}
          onReset={() => handleCustomPromptChange('')}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showAdminPanel && (
        <AdminMentorPanel
          mentors={mentors}
          onUpdated={handleMentorsUpdated}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}
