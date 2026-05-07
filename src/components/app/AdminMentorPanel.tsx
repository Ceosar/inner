import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mentor } from '../../lib/mentors';
import { X, Plus, Save, Edit2, Trash2, ArrowLeft, LayoutGrid } from 'lucide-react';

const INITIAL_FORM: Mentor = {
  id: '',
  name: '',
  tag: '',
  icon: '🧠',
  short_desc: '',
  full_desc: '',
  gradient: 'from-cyan-900/40 to-blue-900/40',
  glow_color: '#06b6d4',
  base_prompt: '',
};

export default function AdminMentorPanel({
  mentors,
  onUpdated,
  onClose,
}: {
  mentors: Mentor[];
  onUpdated: () => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const [form, setForm] = useState<Mentor>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Mentor | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    const isNew = !mentors.find(m => m.id === form.id);
    if (isNew) {
      const newId = form.name.toLowerCase().trim().replace(/\s+/g, '-');
      await supabase.from('mentors').insert({ ...form, id: newId });
    } else {
      await supabase.from('mentors').upsert(form);
    }
    onUpdated();
    setEditing(false);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('mentors').delete().eq('id', deleteTarget.id);
    onUpdated();
    setDeleteTarget(null);
    if (form.id === deleteTarget.id) {
      setEditing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="relative w-full max-w-5xl h-[85vh] overflow-hidden rounded-2xl border border-white/10 flex flex-col"
        style={{ background: 'rgba(8,12,28,0.98)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white">Mentor Management</h2>
              <p className="text-xs text-white/40 flex items-center gap-1.5">
                <LayoutGrid size={12} /> {mentors.length} active personas
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setForm(INITIAL_FORM);
              setEditing(true);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-medium text-white transition-all flex items-center gap-2"
          >
            <Plus size={14} /> New Mentor
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* List Section */}
          <div
            className={`flex-1 overflow-y-auto p-6 space-y-3 transition-all ${editing ? 'hidden md:block border-r border-white/5' : ''}`}
          >
            {mentors.map(m => (
              <div
                key={m.id}
                className="group flex justify-between items-center bg-white/[0.03] border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 flex items-center justify-center rounded-lg text-xl"
                    style={{
                      background: `${m.glow_color}15`,
                      border: `1px solid ${m.glow_color}30`,
                    }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">{m.name}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      {m.tag}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setForm(m);
                      setEditing(true);
                    }}
                    className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(m)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Editor Section */}
          {editing && (
            <div className="w-full md:w-[450px] overflow-y-auto p-6 bg-white/[0.01] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-white/70">
                  {form.id ? `Editing: ${form.name}` : 'New Mentor'}
                </h3>
                <button
                  onClick={() => setEditing(false)}
                  className="text-white/30 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-white/40 uppercase ml-1">
                      Name
                    </label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/20"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-white/40 uppercase ml-1">
                      Tag
                    </label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/20"
                      value={form.tag}
                      onChange={e => setForm({ ...form, tag: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-white/40 uppercase ml-1">
                    System Prompt
                  </label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/20 resize-none min-h-[300px]"
                    value={form.base_prompt}
                    onChange={e => setForm({ ...form, base_prompt: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-3 text-xs font-medium text-white/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-[2] bg-white text-black py-3 rounded-xl text-xs font-bold hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Processing...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-900 border border-white/10 p-6 rounded-xl w-80 text-center">
              <p className="text-sm text-white/80 mb-4">
                Delete <span className="font-semibold text-white">{deleteTarget.name}</span>?
                <br />
                <span className="text-xs text-white/40">This action cannot be undone.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
