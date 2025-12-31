import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const themeToggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  background: 'transparent',
  color: vars.text.secondary,
  transition: 'all 0.15s ease',
  ':hover': {
    background: vars.bg.hover,
    color: vars.text.primary,
  },
});

export const themeToggleTrack = style({
  position: 'relative',
  width: '48px',
  height: '26px',
  background: vars.bg.tertiary,
  borderRadius: '13px',
  border: `1px solid ${vars.border.default}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 6px',
  transition: 'all 0.2s ease',
});

export const themeToggleIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  transition: 'opacity 0.2s ease',
});

export const sunIcon = style({
  color: vars.status.warning,
  opacity: 0.4,
});

export const moonIcon = style({
  color: vars.accent.default,
  opacity: 0.4,
});

// Data attribute based styles for active states
globalStyle(`${themeToggleTrack}[data-theme="light"] .${sunIcon}`, {
  opacity: 1,
});

globalStyle(`${themeToggleTrack}[data-theme="dark"] .${moonIcon}`, {
  opacity: 1,
});

export const themeToggleThumb = style({
  position: 'absolute',
  width: '20px',
  height: '20px',
  background: vars.text.primary,
  borderRadius: '50%',
  left: '3px',
  transition: 'transform 0.2s ease',
});

globalStyle(`${themeToggleTrack}[data-theme="dark"] .${themeToggleThumb}`, {
  transform: 'translateX(22px)',
});

export const themeToggleLabel = style({
  fontSize: '13px',
  fontWeight: 500,
});

