import React from 'react';
import './internshipsSections.css';

type ExpandedHeroProps = {
  backgroundImage: string;
  objectPosition?: string;
  align?: 'left' | 'center';
  /** When true, hero fills the panel and shows intro copy + CTA instead of banner tagline. */
  fillPanel?: boolean;
  tagline?: string;
  subtitle?: string;
  introEyebrow?: string;
  introLines?: string[];
  /** Cover-mode tint. Expanded banner stays crimson unless overridden. */
  coverOverlayColor?: string;
  cta?: React.ReactNode;
};

const mockFont = 'Georgia, "Times New Roman", Times, serif';
const PANEL_WIDTH_MS = 900;

export default function ExpandedHero({
  backgroundImage,
  objectPosition = 'center',
  align = 'center',
  fillPanel = false,
  tagline,
  subtitle,
  introEyebrow,
  introLines,
  coverOverlayColor = 'rgba(146, 9, 5, 0.72)',
  cta,
}: ExpandedHeroProps) {
  const isCentered = align === 'center';
  const overlayColor = fillPanel ? coverOverlayColor : 'rgba(158, 27, 50, 0.55)';

  return (
    <div
      className={`apc-intern-hero${fillPanel ? ' apc-intern-hero--cover' : ''}`}
      style={{
        minHeight: fillPanel ? '100vh' : '28vh',
        height: fillPanel ? '100vh' : undefined,
        transition: `min-height ${PANEL_WIDTH_MS}ms cubic-bezier(0.33, 0.05, 0.2, 1), height ${PANEL_WIDTH_MS}ms cubic-bezier(0.33, 0.05, 0.2, 1)`,
      }}
    >
      <img
        src={backgroundImage}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: overlayColor,
          transition: 'background-color 400ms ease',
        }}
      />
      <div
        style={
          fillPanel
            ? {
                position: 'absolute',
                left: '50%',
                top: '40%',
                zIndex: 10,
                width: '100%',
                padding: '0 1rem',
                textAlign: 'center',
                transform: 'translate(-50%, -50%)',
              }
            : {
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '48rem',
                margin: '0 auto',
                padding: '2.5rem 1.5rem',
                textAlign: isCentered ? 'center' : 'left',
              }
        }
      >
        {fillPanel ? (
          <div className="apc-intern-cover-copy flex w-full flex-col items-center gap-8 text-center">
            {introEyebrow ? (
              <h4 className="apc-intern-cover-eyebrow mb-2 font-normal italic leading-tight">
                {introEyebrow}
              </h4>
            ) : null}
            {introLines?.length ? (
              <h3 className="apc-intern-cover-headline mb-8 font-semibold leading-none tracking-tight">
                {introLines.map((line) => (
                  <span key={line} className="apc-intern-cover-line">
                    {line}
                  </span>
                ))}
              </h3>
            ) : null}
            {cta}
          </div>
        ) : (
          <>
            {tagline ? (
              <h2
                style={{
                  fontFamily: mockFont,
                  color: '#ffffff',
                  fontWeight: 400,
                  margin: 0,
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  lineHeight: 1.15,
                }}
              >
                {tagline}
              </h2>
            ) : null}
            {subtitle ? (
              <p
                style={{
                  fontFamily: mockFont,
                  fontStyle: 'italic',
                  color: '#ffffff',
                  fontWeight: 400,
                  margin: '0.75rem 0 0',
                  fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
