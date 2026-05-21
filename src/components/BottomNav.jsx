import { LeafIcon, MortarIcon, BookIcon } from './Glyphs.jsx';

const TABS = [
  { id: 'cupboard', label: 'Cupboard', Icon: LeafIcon },
  { id: 'cauldron', label: 'Cauldron', Icon: MortarIcon },
  { id: 'grimoire', label: 'Grimoire', Icon: BookIcon },
];

export default function BottomNav({ active, onChange, cauldronCount = 0 }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((tab) => {
        const Glyph = tab.Icon;
        return (
          <button
            key={tab.id}
            type="button"
            className={active === tab.id ? 'active' : ''}
            onClick={() => onChange(tab.id)}
            aria-current={active === tab.id ? 'page' : undefined}
          >
            <Glyph size={22} className="nav-icon" />
            <span className="nav-label">{tab.label}</span>
            {tab.id === 'cauldron' && cauldronCount > 0 ? (
              <span className="badge">{cauldronCount}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
