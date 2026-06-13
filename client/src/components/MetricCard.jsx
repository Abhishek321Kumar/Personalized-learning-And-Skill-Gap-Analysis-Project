import { percent } from "../utils/formatters";

export function MetricCard({ label, value, tone = "neutral", suffix = "" }) {
  const displayValue = typeof value === "number" && suffix === "%" ? percent(value) : `${value}${suffix}`;

  return (
    <article className={`metric-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{displayValue}</strong>
    </article>
  );
}

