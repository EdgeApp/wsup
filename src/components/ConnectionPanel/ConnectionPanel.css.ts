import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

export const connectionPanel = style({
  padding: '20px 24px',
  borderBottom: `1px solid ${vars.border.default}`,
  background: vars.bg.secondary,
});

export const connectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
});

export const connectionTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '15px',
  fontWeight: 600,
  color: vars.text.primary,
});

globalStyle(`${connectionTitle} svg`, {
  color: vars.accent.default,
});

export const connectionStatus = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const statusDot = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: 'currentColor',
  animation: `${pulse} 2s ease-in-out infinite`,
});

// Remove animation for success status
globalStyle(`.badge-success .${statusDot}`, {
  animation: 'none',
});

export const connectionForm = style({
  display: 'flex',
  gap: '12px',
});

export const urlInputGroup = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
});

export const urlInput = style({
  width: '100%',
  selectors: {
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
});

export const connectBtn = style({
  minWidth: '140px',
  whiteSpace: 'nowrap',
});

export const connectionError = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '12px',
  padding: '10px 14px',
  background: vars.status.dangerBg,
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: '8px',
  color: vars.status.danger,
  fontSize: '13px',
});

