import { useState } from 'react';
import type { Mentor } from '../../lib/mentors';

type Props = {
  mentor: Mentor;
  onClick: () => void;
};

export default function MentorCard({ mentor, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{ perspective: '800px' }}
    >
      <div
        className="relative rounded-2xl border p-6 transition-all duration-300"
        style={{
          transform: hovered
            ? `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(10px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
          background: hovered
            ? `linear-gradient(135deg, rgba(10,20,40,0.95), rgba(15,25,50,0.95))`
            : 'rgba(10,15,30,0.6)',
          borderColor: hovered ? mentor.glow_color + '50' : 'rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? `0 0 30px ${mentor.glow_color}25, 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`
            : '0 4px 20px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {/* Glow effect on hover */}
        {hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-20"
            style={{
              background: `radial-gradient(circle at center, ${mentor.glow_color}, transparent 70%)`,
            }}
          />
        )}

        {/* Icon */}
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition-all duration-300"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${mentor.glow_color}25, ${mentor.glow_color}10)`
              : 'rgba(255,255,255,0.06)',
            border: `1px solid ${hovered ? mentor.glow_color + '40' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: hovered ? `0 0 20px ${mentor.glow_color}30` : 'none',
          }}
        >
          {mentor.icon}
        </div>

        {/* Name & tag */}
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-base font-semibold text-white">{mentor.name}</h3>
        </div>
        <div
          className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: `${mentor.glow_color}15`,
            color: mentor.glow_color,
            border: `1px solid ${mentor.glow_color}30`,
          }}
        >
          {mentor.tag}
        </div>

        {/* Short desc */}
        <p className="text-sm leading-relaxed text-white/50">{mentor.short_desc}</p>

        {/* Expanded description on hover */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: hovered ? '80px' : '0px', opacity: hovered ? 1 : 0 }}
        >
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-xs leading-relaxed text-white/40">{mentor.full_desc}</p>
          </div>
        </div>

        {/* CTA hint on hover */}
        <div
          className="mt-3 flex items-center gap-1 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          }}
        >
          <span className="text-xs font-medium" style={{ color: mentor.glow_color }}>
            Talk to {mentor.name.split(' ')[0]}
          </span>
          <span className="text-xs" style={{ color: mentor.glow_color }}>
            →
          </span>
        </div>
      </div>
    </div>
  );
}
