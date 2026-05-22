/**
 * Inline SVG glyphs. Strokes use `currentColor` so callers can tint via CSS.
 * Kept hand-drawn / imperfect on purpose — this is an herbarium, not a dashboard.
 */

function Svg({ size = 24, viewBox = '0 0 24 24', children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ------------ Nav / UI glyphs ------------ */

export function LeafIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 19c3-10 9-14 16-14-.5 7-4 13-14 15-1.5.3-2.2-.3-2-1z" />
      <path d="M6 18c4-5 8-8 12-10" />
    </Svg>
  );
}

export function MortarIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 10h10l-1.2 6a2 2 0 0 1-2 1.7h-3.6a2 2 0 0 1-2-1.7z" />
      <path d="M5.5 10h13" />
      <path d="M14 9V5l3-1" />
    </Svg>
  );
}

export function BookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 5c2-1 5-1.5 7 0v13c-2-1.5-5-1-7 0z" />
      <path d="M19 5c-2-1-5-1.5-7 0v13c2-1.5 5-1 7 0z" />
      <path d="M7 8h3.5M7 11h3.5M13.5 8H17M13.5 11H17" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 4 4" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props} strokeWidth="1.5">
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function PencilIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m14 6 4 4" />
    </Svg>
  );
}

export function TrashIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M8 7l1 12h6l1-12" />
      <path d="M10 11v5M14 11v5" />
    </Svg>
  );
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  );
}

export function BasketIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 9h16l-1.5 9.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5z" />
      <path d="M4 9h16" />
      <path d="M8 9 11 4M16 9 13 4" />
    </Svg>
  );
}

export function ShelfIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 18h16M4 12h16M4 6h16" />
      <path d="M8 6v12M14 6v12M20 6v12" opacity="0.35" />
    </Svg>
  );
}

export function ListIcon(props) {
  return (
    <Svg {...props}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ChevronLeft(props) {
  return (
    <Svg {...props}>
      <path d="m15 6-6 6 6 6" />
    </Svg>
  );
}

export function ChevronDown(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

/* ------------ Brand mark ------------ */

/** Tiny sprig — used in the header next to the wordmark. */
export function HeaderMark(props) {
  return (
    <Svg {...props} viewBox="0 0 14 14" strokeWidth="1">
      <path d="M7 13V3" />
      <path d="M7 7c-2-1-3-2.5-3-4" />
      <path d="M7 9c2-1 3-2.5 3-4.5" />
      <path d="M7 5c-1.5-.5-2.5-1.5-2.5-2.5" />
    </Svg>
  );
}

/* ------------ Recipe card ornaments ------------ */

/** Symmetrical sprig pair, used above the card title. */
export function CardOrnamentTop({ size = 80 }) {
  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 160 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* left sprig */}
      <g>
        <path d="M10 60 Q 40 40 70 36" />
        <path d="M22 54 Q 20 46 26 42" />
        <path d="M34 48 Q 32 40 38 36" />
        <path d="M46 42 Q 44 34 50 30" />
        <path d="M58 38 Q 56 30 62 26" />
      </g>
      {/* right sprig (mirrored) */}
      <g transform="translate(160 0) scale(-1 1)">
        <path d="M10 60 Q 40 40 70 36" />
        <path d="M22 54 Q 20 46 26 42" />
        <path d="M34 48 Q 32 40 38 36" />
        <path d="M46 42 Q 44 34 50 30" />
        <path d="M58 38 Q 56 30 62 26" />
      </g>
      {/* center pressed flower */}
      <g transform="translate(80 30)">
        <circle r="3" />
        <path d="M0 -3 v-8" />
        <ellipse cx="0" cy="-3" rx="3" ry="4" transform="rotate(0)" />
        <ellipse cx="3" cy="0" rx="3" ry="4" transform="rotate(72)" />
        <ellipse cx="3" cy="0" rx="3" ry="4" transform="rotate(144)" />
        <ellipse cx="3" cy="0" rx="3" ry="4" transform="rotate(216)" />
        <ellipse cx="3" cy="0" rx="3" ry="4" transform="rotate(288)" />
      </g>
    </svg>
  );
}

/** Small closing sprig at the bottom of the card. */
export function CardOrnamentBottom({ size = 60 }) {
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 120 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M60 44 V 18" />
      <path d="M60 34 Q 46 30 42 20" />
      <path d="M60 34 Q 74 30 78 20" />
      <path d="M60 26 Q 50 24 48 18" />
      <path d="M60 26 Q 70 24 72 18" />
      <circle cx="60" cy="14" r="2.5" />
      <path d="M55 12 Q 58 8 60 12" />
      <path d="M65 12 Q 62 8 60 12" />
    </svg>
  );
}

/** Small mossy sprig used on cauldron hero and empty states. */
export function Sprig({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 44 V 14" />
      <path d="M24 36 Q 12 32 10 22" />
      <path d="M24 28 Q 14 24 12 16" />
      <path d="M24 32 Q 36 28 38 18" />
      <path d="M24 24 Q 34 20 36 12" />
      <circle cx="24" cy="10" r="3" />
      <path d="M22 7 Q 24 4 26 7" />
    </svg>
  );
}
