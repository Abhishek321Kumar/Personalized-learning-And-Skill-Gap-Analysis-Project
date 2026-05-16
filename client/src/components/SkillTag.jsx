export function SkillTag({ label, variant = "filled" }) {
  return <span className={`skill-tag ${variant}`}>{label}</span>;
}

