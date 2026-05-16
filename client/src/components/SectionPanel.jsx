export function SectionPanel({ eyebrow, title, description, children, actions }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="panel-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

