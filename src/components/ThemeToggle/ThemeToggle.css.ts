import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const themeToggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '8px 12px',
});

export const themeOption = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '28px',
  borderRadius: '6px',
  background: 'transparent',
  border: `1px solid transparent`,
  color: vars.text.muted,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  ':hover': {
    background: vars.bg.hover,
    color: vars.text.secondary,
  },
});

export const themeOptionActive = style({
  background: vars.bg.tertiary,
  border: `1px solid ${vars.border.default}`,
  color: vars.text.primary,
  ':hover': {
    background: vars.bg.tertiary,
    color: vars.text.primary,
  },
});

export const themeToggleLabel = style({
  fontSize: '13px',
  fontWeight: 500,
  color: vars.text.secondary,
  marginLeft: 'auto',
});

