export default function ReferenceSection({ label, items, variant = 'default' }) {
  if (!items?.length) return null;
  return (
    <section className={'reference-section' + (variant !== 'default' ? ` reference-section--${variant}` : '')}>
      <h3 className="reference-section-label">{label}</h3>
      <ul className={'reference-list' + (variant === 'caution' ? ' reference-list--caution' : '')}>
        {items.map((line, i) => (
          <li key={`${label}-${i}`}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
