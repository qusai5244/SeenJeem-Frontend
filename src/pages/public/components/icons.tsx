// ----------------------------------------------------------------------
// SeenJeem's own line-icon set — 2px stroke, rounded joins/caps, 24px canvas,
// currentColor only. Small and local rather than pulling in an icon package,
// per the design system's "one custom line-icon set... no stock icon packs".
// ----------------------------------------------------------------------

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

function makeIcon(paths: React.ReactNode) {
  function Icon({ size = 24, strokeWidth = 2, className, style }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {paths}
      </svg>
    );
  }
  return Icon;
}

export const IconCheck = makeIcon(<polyline points="20 6 9 17 4 12" />);

export const IconX = makeIcon(
  <>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </>
);

export const IconClock = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
);

export const IconAlertCircle = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" />
  </>
);

export const IconSwap = makeIcon(
  <>
    <path d="M4 4v6h6M20 20v-6h-6" />
    <path d="M20 10a8 8 0 0 0-14.9-3M4 14a8 8 0 0 0 14.9 3" />
  </>
);

export const IconLock = makeIcon(
  <>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>
);

export const IconChevronDown = makeIcon(<path d="m6 9 6 6 6-6" />);

export const IconArrowRight = makeIcon(<path d="M5 12h14M13 6l6 6-6 6" />);

export const IconInbox = makeIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M9 9h.01M15 9h.01M9.5 15a3.5 3.5 0 0 0 5 0" />
  </>
);

export const IconSun = makeIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </>
);

export const IconMoon = makeIcon(<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />);

export const IconCopy = makeIcon(
  <>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </>
);

export const IconPlus = makeIcon(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>
);

export const IconShuffle = makeIcon(
  <>
    <path d="M3 6h3.5l7 12H20" />
    <path d="M17 3l3 3-3 3" />
    <path d="M20 6h-3.5l-1.8 3.2" />
    <path d="M3 18h3.5l1.8-3.2" />
    <path d="M17 21l3-3-3-3" />
    <path d="M20 18h-3.5l-7-12H3" />
  </>
);
