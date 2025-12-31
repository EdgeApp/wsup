import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const messageComposer = style({
  display: 'flex',
  flexDirection: 'column',
  borderTop: `1px solid ${vars.border.default}`,
  background: vars.bg.primary,
  flexShrink: 0,
});

export const messageComposerResizing = style({
  userSelect: 'none',
});

export const resizeHandle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '8px',
  cursor: 'ns-resize',
  background: vars.bg.secondary,
  transition: 'background 0.15s ease',
  ':hover': {
    background: vars.bg.tertiary,
  },
});

export const resizeHandleBar = style({
  width: '40px',
  height: '3px',
  background: vars.border.default,
  borderRadius: '2px',
  transition: 'all 0.15s ease',
});

globalStyle(`${resizeHandle}:hover .${resizeHandleBar}`, {
  background: vars.accent.default,
  width: '60px',
});

globalStyle(`${messageComposerResizing} .${resizeHandle}`, {
  background: vars.bg.tertiary,
});

globalStyle(`${messageComposerResizing} .${resizeHandleBar}`, {
  background: vars.accent.default,
  width: '60px',
});

export const tabBar = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  padding: '0 16px',
  background: vars.bg.secondary,
  minHeight: '40px',
  position: 'relative',
  flexShrink: 0,
});

export const tabsWrapper = style({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'stretch',
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '48px',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.15s ease',
    zIndex: 10,
    background: `linear-gradient(to right, ${vars.bg.secondary}, transparent)`,
  },
  '::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '36px',
    width: '48px',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.15s ease',
    zIndex: 10,
    background: `linear-gradient(to left, ${vars.bg.secondary}, transparent)`,
  },
});

export const tabsWrapperCanScrollLeft = style({
  '::before': {
    opacity: 1,
  },
});

export const tabsWrapperCanScrollRight = style({
  '::after': {
    opacity: 1,
  },
});

export const tabsContainer = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '2px',
  overflowX: 'auto',
  overflowY: 'hidden',
  flex: 1,
  paddingTop: '8px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

export const tab = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  background: 'transparent',
  border: '1px solid transparent',
  borderBottom: 'none',
  borderRadius: '8px 8px 0 0',
  fontSize: '12px',
  color: vars.text.secondary,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
  maxWidth: '180px',
  position: 'relative',
  marginBottom: '-1px',
  selectors: {
    '&:hover:not(.active)': {
      background: vars.bg.tertiary,
      color: vars.text.primary,
    },
  },
});

export const tabActive = style({
  background: vars.bg.primary,
  borderColor: vars.border.default,
  color: vars.text.primary,
  fontWeight: 500,
  zIndex: 1,
  '::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '-10px',
    width: '10px',
    height: '10px',
    pointerEvents: 'none',
    background: `radial-gradient(circle at 0 0, transparent 10px, ${vars.bg.primary} 10px)`,
  },
  '::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: '-10px',
    width: '10px',
    height: '10px',
    pointerEvents: 'none',
    background: `radial-gradient(circle at 100% 0, transparent 10px, ${vars.bg.primary} 10px)`,
  },
});

export const tabModified = style({});

globalStyle(`${tabModified} .tab-name`, {
  color: vars.status.warning,
});

export const tabName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '120px',
});

export const tabModifiedDot = style({
  color: vars.status.warning,
  fontSize: '16px',
  lineHeight: 1,
  marginLeft: '-2px',
});

export const tabClose = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  padding: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: '3px',
  color: vars.text.muted,
  cursor: 'pointer',
  opacity: 0,
  transition: 'all 0.1s ease',
  ':hover': {
    opacity: '1 !important' as any,
    background: vars.bg.hover,
    color: vars.text.primary,
  },
});

globalStyle(`${tab}:hover .${tabClose}`, {
  opacity: 0.6,
});

export const newTabBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  padding: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: '6px',
  color: vars.text.muted,
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  flexShrink: 0,
  alignSelf: 'flex-end',
  marginBottom: '6px',
  marginLeft: '4px',
  ':hover': {
    background: vars.bg.tertiary,
    color: vars.accent.default,
  },
});

export const btnSaveTab = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  fontSize: '11px',
  fontWeight: 500,
  background: vars.bg.tertiary,
  color: vars.text.secondary,
  border: `1px solid ${vars.border.default}`,
  ':hover': {
    background: vars.bg.hover,
    color: vars.text.primary,
  },
});

export const btnUpdateTab = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  fontSize: '11px',
  fontWeight: 500,
  background: vars.status.warningBg,
  color: vars.status.warning,
  border: `1px solid ${vars.status.warning}`,
  ':hover': {
    background: vars.status.warning,
    color: vars.bg.primary,
  },
});

export const composerContent = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  gap: '16px',
  padding: '16px',
});

export const composerBody = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: 0,
});

export const composerTextarea = style({
  flex: 1,
  minHeight: 0,
  resize: 'none',
  lineHeight: 1.6,
  fontSize: '13px',
});

export const composerTextareaHasError = style({
  borderColor: vars.status.danger,
  ':focus': {
    boxShadow: `0 0 0 3px ${vars.status.dangerBg}`,
  },
});

export const composerError = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '8px',
  fontSize: '12px',
  color: vars.status.danger,
});

export const formatSelect = style({
  minWidth: '100px',
});

export const templateVariables = style({
  width: '280px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '12px 16px',
  background: vars.input.bg,
  border: `1px solid ${vars.border.default}`,
  borderRadius: '8px',
  overflowY: 'auto',
});

export const variablesHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
  fontSize: '12px',
  fontWeight: 600,
  color: vars.text.secondary,
  flexShrink: 0,
});

globalStyle(`${variablesHeader} svg`, {
  color: vars.accent.default,
});

export const variablesGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  flex: 1,
});

export const variableField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const variableLabel = style({
  fontSize: '11px',
  fontWeight: 600,
  fontFamily: "'JetBrains Mono', monospace",
  color: vars.accent.default,
});

export const variableInput = style({
  padding: '8px 10px',
  fontSize: '12px',
});

export const composerFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '12px 24px',
  borderTop: `1px solid ${vars.border.default}`,
  background: vars.bg.secondary,
});

export const composerControlsLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const composerControlsRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

export const composerHints = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const composerHint = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '12px',
  color: vars.text.muted,
});

globalStyle(`${composerHint} kbd`, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '20px',
  padding: '2px 6px',
  background: vars.bg.tertiary,
  border: `1px solid ${vars.border.default}`,
  borderRadius: '4px',
  fontFamily: 'inherit',
  fontSize: '11px',
});

export const variableHint = style({
  fontSize: '11px',
});

export const hintMuted = style({
  color: vars.text.muted,
});

globalStyle(`${hintMuted} code`, {
  background: vars.bg.tertiary,
  padding: '2px 5px',
  borderRadius: '3px',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  color: vars.accent.default,
});

export const hintShortcut = style({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

export const hintWarning = style({
  color: vars.status.warning,
});

export const hintReady = style({
  color: vars.status.success,
});

export const sendBtn = style({
  minWidth: '100px',
  selectors: {
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

