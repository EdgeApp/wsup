import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const fabAppear = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0.8) translateY(10px)',
  },
  to: {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  },
});

export const messageLog = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: vars.bg.primary,
});

export const logHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  height: '61px',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${vars.border.default}`,
  background: vars.bg.secondary,
  WebkitAppRegion: 'drag',
  // @ts-ignore
  appRegion: 'drag',
  userSelect: 'none',
});

export const logTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: 600,
  color: vars.text.secondary,
});

globalStyle(`${logTitle} svg`, {
  color: vars.accent.default,
});

export const logConnection = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 10px',
  background: vars.bg.tertiary,
  borderRadius: '4px',
  fontSize: '11px',
  color: vars.text.muted,
  marginLeft: '8px',
});

export const statusIndicator = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: vars.text.muted,
  opacity: 0.5,
});

export const statusIndicatorConnected = style({
  background: vars.status.success,
  opacity: 1,
  boxShadow: `0 0 4px ${vars.status.success}`,
});

export const logCount = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '22px',
  height: '22px',
  padding: '0 7px',
  background: vars.accent.subtle,
  color: vars.accent.default,
  borderRadius: '11px',
  fontSize: '11px',
  fontWeight: 600,
});

export const logControls = style({
  display: 'flex',
  gap: '4px',
  WebkitAppRegion: 'no-drag',
  // @ts-ignore
  appRegion: 'no-drag',
});

export const logBodyWrapper = style({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const logBody = style({
  flex: 1,
  overflowY: 'auto',
  padding: '16px 24px',
});

export const scrollToBottomFab = style({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: vars.accent.default,
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
  zIndex: 10,
  animation: `${fabAppear} 0.2s ease`,
  ':hover': {
    background: vars.accent.hover,
    transform: 'scale(1.05)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)',
  },
  ':active': {
    transform: 'scale(0.95)',
  },
});

globalStyle(`${scrollToBottomFab} svg`, {
  flexShrink: 0,
});

export const logEmpty = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  minHeight: '200px',
  color: vars.text.muted,
  textAlign: 'center',
});

globalStyle(`${logEmpty} svg`, {
  marginBottom: '16px',
  opacity: 0.4,
});

globalStyle(`${logEmpty} p`, {
  fontSize: '15px',
  fontWeight: 500,
  color: vars.text.secondary,
  marginBottom: '4px',
});

globalStyle(`${logEmpty} span`, {
  fontSize: '13px',
  maxWidth: '280px',
});

export const logMessage = style({
  marginBottom: '12px',
  borderRadius: '8px',
  overflow: 'hidden',
});

export const logMessageSent = style({
  background: vars.msg.sentBg,
  border: `1px solid ${vars.msg.sentBorder}`,
});

export const logMessageReceived = style({
  background: vars.msg.recvBg,
  border: `1px solid ${vars.msg.recvBorder}`,
});

export const messageHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  background: 'rgba(0, 0, 0, 0.1)',
});

globalStyle(`[data-theme="light"] .${messageHeader}`, {
  background: 'rgba(0, 0, 0, 0.03)',
});

export const messageDirection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.5px',
});

export const messageDirectionSent = style({
  color: vars.accent.default,
});

export const messageDirectionReceived = style({
  color: vars.msg.recvAccent,
});

export const messageMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '11px',
  color: vars.text.muted,
});

export const messageFormat = style({
  padding: '2px 6px',
  background: vars.bg.tertiary,
  borderRadius: '4px',
  fontWeight: 500,
});

export const messageContent = style({
  padding: '12px',
  margin: 0,
  fontSize: '12px',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  color: vars.text.primary,
});

