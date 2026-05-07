export type Mentor = {
  id: string;
  name: string;
  tag: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  gradient: string;
  glowColor: string;
  base_prompt: string;
};

export function getMentorById(mentors: Mentor[], id: string): Mentor {
  return mentors.find(m => m.id === id) ?? mentors[0];
}
