import { Component, For, Show, createEffect, createSignal, createMemo } from 'solid-js';
import { useConnection, Message } from '../../stores/connections';
import { formatTime, formatBytes, formatJson } from '../../utils/formatters';
import * as styles from './MessageLog.css';
import { btnIcon } from '../../styles/global.css';

export const MessageLog: Component = () => {
  const { state, selectedConnection, clearMessages } = useConnection();
  let logRef: HTMLDivElement | undefined;
  const [autoScroll, setAutoScroll] = createSignal(true);

  const currentConnection = createMemo(() => selectedConnection());
  const messages = createMemo(() => currentConnection()?.messages || []);

  const getHostname = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return url;
    }
  };

  createEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages().length && autoScroll() && logRef) {
      logRef.scrollTop = logRef.scrollHeight;
    }
  });

  const handleScroll = () => {
    if (!logRef) return;
    // Disable auto-scroll if user scrolls up
    const isAtBottom = logRef.scrollHeight - logRef.scrollTop <= logRef.clientHeight + 50;
    setAutoScroll(isAtBottom);
  };

  const renderContent = (msg: Message) => {
    if (msg.format === 'json') {
      try {
        return formatJson(msg.content);
      } catch {
        return msg.content;
      }
    }
    return msg.content;
  };

  return (
    <div class={styles.messageLog}>
      <div class={styles.logHeader}>
        <div class={styles.logTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span>Messages</span>
          <Show when={currentConnection()}>
            <span class={`${styles.logConnection} mono`}>
              <span class={`${styles.statusIndicator} ${currentConnection()?.status === 'connected' ? styles.statusIndicatorConnected : ''}`}></span>
              {getHostname(currentConnection()!.url)}
            </span>
          </Show>
          <Show when={messages().length > 0}>
            <span class={styles.logCount}>{messages().length}</span>
          </Show>
        </div>
        
        <div class={styles.logControls}>
          <button
            class={btnIcon}
            onClick={() => clearMessages()}
            disabled={messages().length === 0}
            title="Clear messages"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class={styles.logBodyWrapper}>
        <div class={styles.logBody} ref={logRef} onScroll={handleScroll}>
          <Show
            when={messages().length > 0}
            fallback={
              <div class={styles.logEmpty}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>No messages yet</p>
                <span>{currentConnection() ? 'Send a message to see it here' : 'Add a connection in the sidebar to get started'}</span>
              </div>
            }
          >
            <For each={messages()}>
              {(msg) => (
                <div class={`${styles.logMessage} ${msg.type === 'sent' ? styles.logMessageSent : styles.logMessageReceived}`}>
                  <div class={styles.messageHeader}>
                    <span class={`${styles.messageDirection} ${msg.type === 'sent' ? styles.messageDirectionSent : styles.messageDirectionReceived}`}>
                      {msg.type === 'sent' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="19" y1="12" x2="5" y2="12"></line>
                          <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                      )}
                      {msg.type === 'sent' ? 'SENT' : 'RECEIVED'}
                    </span>
                    <span class={styles.messageMeta}>
                      <span class={styles.messageFormat}>{msg.format.toUpperCase()}</span>
                      <span>{formatBytes(msg.size)}</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </span>
                  </div>
                  <pre class={`${styles.messageContent} mono`}>{renderContent(msg)}</pre>
                </div>
              )}
            </For>
          </Show>
        </div>
        
        <Show when={!autoScroll() && messages().length > 0}>
          <button
            class={styles.scrollToBottomFab}
            onClick={() => {
              setAutoScroll(true);
              if (logRef) logRef.scrollTop = logRef.scrollHeight;
            }}
            title="Scroll to latest messages"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </button>
        </Show>
      </div>
    </div>
  );
};

