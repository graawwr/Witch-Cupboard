export default function EmptyState({ glyph, glyphComponent, title, children, action }) {
  return (
    <div className="empty-state">
      {glyphComponent ? (
        <span className="glyph" aria-hidden>{glyphComponent}</span>
      ) : glyph ? (
        <span className="glyph" role="img" aria-hidden>{glyph}</span>
      ) : null}
      {title ? <h3>{title}</h3> : null}
      {children ? <p>{children}</p> : null}
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}
