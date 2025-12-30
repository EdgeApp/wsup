import { Component, For, Show, createEffect, createSignal, createMemo } from 'solid-js';
import { useConnection, Message } from '../../stores/connections';
import { formatTime, formatBytes, formatJson } from '../../utils/formatters';
import './MessageLog.css';

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
    <div class="message-log">
      <div class="log-header">
        <div class="log-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span>Messages</span>
          <Show when={currentConnection()}>
            <span class="log-connection mono">
              <span class={`status-indicator ${currentConnection()?.status === 'connected' ? 'connected' : ''}`}></span>
              {getHostname(currentConnection()!.url)}
            </span>
          </Show>
          <Show when={messages().length > 0}>
            <span class="log-count">{messages().length}</span>
          </Show>
        </div>
        
        <div class="log-controls">
          <button
            class="btn-icon"
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

      <div class="log-body-wrapper">
        <div class="log-body" ref={logRef} onScroll={handleScroll}>
          <Show
            when={messages().length > 0}
            fallback={
              <div class="log-empty">
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
                <div class={`log-message ${msg.type}`}>
                  <div class="message-header">
                    <span class="message-direction">
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
                    <span class="message-meta">
                      <span class="message-format">{msg.format.toUpperCase()}</span>
                      <span class="message-size">{formatBytes(msg.size)}</span>
                      <span class="message-time">{formatTime(msg.timestamp)}</span>
                    </span>
                  </div>
                  <pre class="message-content mono">{renderContent(msg)}</pre>
                </div>
              )}
            </For>
          </Show>
        </div>
        
        <Show when={!autoScroll() && messages().length > 0}>
          <button
            class="scroll-to-bottom-fab"
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

