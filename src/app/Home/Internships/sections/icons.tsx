import React from 'react';

type IconProps = {
  className?: string;
  title?: string;
};

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const defaultIconStyle: React.CSSProperties = { width: 40, height: 40, display: 'block' };

export function BriefcaseIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <rect x="8" y="16" width="32" height="24" rx="2" {...strokeProps} />
      <path d="M18 16V12a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4" {...strokeProps} />
      <path d="M8 24h32" {...strokeProps} />
      <path d="M22 26h4" {...strokeProps} />
    </svg>
  );
}

export function ResumeIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <rect x="12" y="6" width="24" height="36" rx="2" {...strokeProps} />
      <circle cx="24" cy="18" r="4" {...strokeProps} />
      <path d="M17 30h14M17 36h10" {...strokeProps} />
    </svg>
  );
}

export function NetworkIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <circle cx="24" cy="14" r="5" {...strokeProps} />
      <circle cx="12" cy="34" r="5" {...strokeProps} />
      <circle cx="36" cy="34" r="5" {...strokeProps} />
      <path d="M20 18 15 30M28 18l5 12M17 34h14" {...strokeProps} />
    </svg>
  );
}

export function GrowthIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M10 36V28M20 36V22M30 36V16M40 36V10" {...strokeProps} />
      <path d="M8 38h32" {...strokeProps} />
      <path d="M28 12l6-4 4 8" {...strokeProps} />
    </svg>
  );
}

export function PeopleIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <circle cx="18" cy="16" r="5" {...strokeProps} />
      <circle cx="32" cy="18" r="4" {...strokeProps} />
      <path d="M8 36c1.5-6 5.5-9 10-9s8.5 3 10 9" {...strokeProps} />
      <path d="M28 36c.8-4 3.5-6.5 7-6.5 2.2 0 4 .8 5.5 2.5" {...strokeProps} />
    </svg>
  );
}

export function LightbulbIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M24 8a10 10 0 0 0-6 18c.8 1 1.5 2.2 1.5 3.5V32h9v-2.5c0-1.3.7-2.5 1.5-3.5A10 10 0 0 0 24 8Z" {...strokeProps} />
      <path d="M20 36h8M21 40h6" {...strokeProps} />
    </svg>
  );
}

export function HandshakeIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M8 24l8-8 6 4 6-4 8 8" {...strokeProps} />
      <path d="M16 16 10 10M32 16l6-6" {...strokeProps} />
      <path d="M18 28l4 4 4-3 4 3" {...strokeProps} />
      <path d="M14 32l4 8M34 32l-4 8" {...strokeProps} />
    </svg>
  );
}

export function GearIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <circle cx="24" cy="24" r="6" {...strokeProps} />
      <path
        d="M24 10v4M24 34v4M10 24h4M34 24h4M14.5 14.5l2.8 2.8M30.7 30.7l2.8 2.8M33.5 14.5l-2.8 2.8M17.3 30.7l-2.8 2.8"
        {...strokeProps}
      />
      <circle cx="24" cy="24" r="14" {...strokeProps} />
    </svg>
  );
}

export function MonitorIcon({ className, title }: IconProps) {
  return (
    <svg className={className} style={defaultIconStyle} viewBox="0 0 48 48" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <rect x="8" y="10" width="32" height="22" rx="2" {...strokeProps} />
      <path d="M18 40h12M24 32v8" {...strokeProps} />
    </svg>
  );
}
