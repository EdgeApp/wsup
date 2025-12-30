import { Component, createSignal, createEffect, createMemo, Show, For, untrack, onMount, onCleanup } from 'solid-js';
import { useConnection, MessageFormat } from '../../stores/connections';
import { useCollections, MessageTemplate } from '../../stores/collections';
import { isValidJson, formatJson } from '../../utils/formatters';
import { MessageTab } from '../../App';
import { SaveModal } from '../SaveModal/SaveModal';
import './MessageComposer.css';

interface MessageComposerProps {
  tabs: MessageTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  onTabUpdate: (updates: Partial<MessageTab>) => void;
  onTabSaved: (tabId: string, template: MessageTemplate) => void;
  isTabModified: (tab: MessageTab) => boolean;
}

const MIN_HEIGHT = 200;
const MAX_HEIGHT = 600;
const DEFAULT_HEIGHT = 300;

// Regex to find template variables: {{variableName}}
const VARIABLE_REGEX = /\{\{(\w+)\}\}/g;

export const MessageComposer: Component<MessageComposerProps> = (props) => {
  const { selectedConnection, send } = useConnection();
  const { state: collections, updateTemplate, addTemplate, addCollection } = useCollections();
  
  const [jsonError, setJsonError] = createSignal<string | null>(null);
  const [showSaveModal, setShowSaveModal] = createSignal(false);
  const [composerHeight, setComposerHeight] = createSignal(DEFAULT_HEIGHT);
  const [isResizing, setIsResizing] = createSignal(false);
  const [canScrollLeft, setCanScrollLeft] = createSignal(false);
  const [canScrollRight, setCanScrollRight] = createSignal(false);
  
  let composerRef: HTMLDivElement | undefined;
  let tabsContainerRef: HTMLDivElement | undefined;

  // Update scroll indicators
  const updateScrollIndicators = () => {
    if (!tabsContainerRef) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  onMount(() => {
    updateScrollIndicators();
    // Also update on resize
    const resizeObserver = new ResizeObserver(updateScrollIndicators);
    if (tabsContainerRef) {
      resizeObserver.observe(tabsContainerRef);
    }
    onCleanup(() => resizeObserver.disconnect());
  });

  // Update indicators when tabs change
  createEffect(() => {
    // Track tabs array
    props.tabs.length;
    // Defer to next frame to let DOM update
    requestAnimationFrame(updateScrollIndicators);
  });

  // Handle resize drag
  const handleResizeStart = (e: MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = composerHeight();

    const handleMouseMove = (e: MouseEvent) => {
      // Dragging up increases height (startY - e.clientY is positive when moving up)
      const delta = startY - e.clientY;
      const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + delta));
      setComposerHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  // Get the active tab
  const activeTab = () => props.tabs.find(t => t.id === props.activeTabId) || null;

  // Get tab content for display
  const message = () => activeTab()?.content || '';
  const format = () => activeTab()?.format || 'json';
  const variableValues = () => activeTab()?.variableValues || {};

  // Detect variables from current message content
  const detectedVariables = createMemo(() => {
    const content = message();
    const vars: string[] = [];
    let match;
    const regex = new RegExp(VARIABLE_REGEX.source, 'g');
    while ((match = regex.exec(content)) !== null) {
      if (!vars.includes(match[1])) {
        vars.push(match[1]);
      }
    }
    return vars;
  });

  // Keep variable values in sync when new variables are detected
  createEffect(() => {
    const tab = activeTab();
    if (!tab) return;
    
    const detected = detectedVariables();
    const current = tab.variableValues;
    
    // Build new variable values object
    const updated: Record<string, string> = {};
    detected.forEach((name) => {
      updated[name] = current[name] ?? '';
    });
    
    // Only update if there's a change
    const needsUpdate = detected.length !== Object.keys(current).length ||
      detected.some(name => !(name in current));
    
    if (needsUpdate) {
      props.onTabUpdate({ variableValues: updated });
    }
  });

  // Resolve message by replacing variables with their values
  const resolvedMessage = createMemo(() => {
    let content = message();
    const vars = variableValues();
    Object.entries(vars).forEach(([name, value]) => {
      content = content.replace(new RegExp(`\\{\\{${name}\\}\\}`, 'g'), value);
    });
    return content;
  });

  // Check if message has unresolved variables
  const hasUnresolvedVariables = createMemo(() => {
    const resolved = resolvedMessage();
    return VARIABLE_REGEX.test(resolved);
  });

  const handleSend = () => {
    const msg = resolvedMessage().trim();
    if (!msg || selectedConnection()?.status !== 'connected') return;

    if (format() === 'json' && !isValidJson(msg)) {
      setJsonError('Invalid JSON format');
      return;
    }

    send(msg, format());
    setJsonError(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + Enter to send
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
    // Cmd/Ctrl + S to save
    if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const tab = activeTab();
      if (tab && props.isTabModified(tab)) {
        if (tab.templateId) {
          handleUpdateTemplate();
        } else {
          handleSaveClick();
        }
      }
    }
    // Cmd/Ctrl + T to create new tab
    if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      props.onNewTab();
    }
    // Cmd/Ctrl + W to close tab
    if (e.key === 'w' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const tab = activeTab();
      if (tab) {
        props.onTabClose(tab.id);
      }
    }
  };

  const handleFormatJson = () => {
    if (format() === 'json' && message().trim()) {
      try {
        const formatted = formatJson(message());
        props.onTabUpdate({ content: formatted });
        setJsonError(null);
      } catch {
        setJsonError('Cannot format - invalid JSON');
      }
    }
  };

  const handleMessageInput = (value: string) => {
    props.onTabUpdate({ content: value });
    
    // Validate JSON if in JSON mode
    if (format() === 'json' && value.trim()) {
      let testValue = value;
      const vars = detectedVariables();
      vars.forEach((name) => {
        testValue = testValue.replace(new RegExp(`\\{\\{${name}\\}\\}`, 'g'), '"placeholder"');
      });
      
      if (!isValidJson(testValue)) {
        setJsonError('Invalid JSON');
      } else {
        setJsonError(null);
      }
    } else {
      setJsonError(null);
    }
  };

  const handleFormatChange = (newFormat: MessageFormat) => {
    props.onTabUpdate({ format: newFormat });
  };

  const handleVariableChange = (name: string, value: string) => {
    props.onTabUpdate({ 
      variableValues: { ...variableValues(), [name]: value } 
    });
  };

  const handleUpdateTemplate = () => {
    const tab = activeTab();
    if (!tab || !tab.templateId) return;
    
    // Find the collection containing this template
    const collection = collections.collections.find((c) =>
      c.templates.some((t) => t.id === tab.templateId)
    );
    if (!collection) return;
    
    // Find the existing template to preserve its name (renaming is done in sidebar)
    const existingTemplate = collection.templates.find(t => t.id === tab.templateId);
    if (!existingTemplate) return;
    
    // Create updated variables array
    const variables = detectedVariables().map((varName) => ({
      name: varName,
      defaultValue: variableValues()[varName] || '',
    }));
    
    updateTemplate(collection.id, tab.templateId, {
      name: existingTemplate.name,
      content: tab.content,
      format: tab.format,
      variables,
    });

    // Notify parent with updated template
    props.onTabSaved(tab.id, {
      ...existingTemplate,
      content: tab.content,
      format: tab.format,
      variables,
    });
  };

  const handleSaveNewTemplate = (collectionId: string, templateName: string) => {
    const tab = activeTab();
    if (!tab) return;
    
    const content = tab.content.trim();
    if (!content) return;

    const name = templateName || 'Untitled';
    const variables = detectedVariables().map((varName) => ({
      name: varName,
      defaultValue: variableValues()[varName] || '',
    }));

    addTemplate(collectionId, {
      name,
      content,
      format: tab.format,
      variables,
    });

    // Find the newly added template
    const collection = collections.collections.find(c => c.id === collectionId);
    const newTemplate = collection?.templates.find(t => t.name === name && t.content === content);
    if (newTemplate) {
      props.onTabSaved(tab.id, newTemplate);
    }

    setShowSaveModal(false);
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleTabClose = (e: MouseEvent, tabId: string) => {
    e.stopPropagation();
    props.onTabClose(tabId);
  };

  const isDisabled = () => selectedConnection()?.status !== 'connected';
  const hasVariables = createMemo(() => detectedVariables().length > 0);
  const isCurrentTabModified = createMemo(() => {
    const tab = activeTab();
    return tab ? props.isTabModified(tab) : false;
  });

  return (
    <div 
      class="message-composer" 
      classList={{ 'is-resizing': isResizing() }}
      ref={composerRef}
      style={{ height: `${composerHeight()}px` }}
    >
      {/* Resize Handle */}
      <div class="resize-handle" onMouseDown={handleResizeStart}>
        <div class="resize-handle-bar"></div>
      </div>

      {/* Tab Bar */}
      <div class="tab-bar">
        <div 
          class="tabs-wrapper"
          classList={{ 
            'can-scroll-left': canScrollLeft(),
            'can-scroll-right': canScrollRight()
          }}
        >
          <div 
            class="tabs-container" 
            ref={tabsContainerRef}
            onScroll={updateScrollIndicators}
          >
            <For each={props.tabs}>
              {(tab) => {
                const isActive = () => tab.id === props.activeTabId;
                const isModified = () => props.isTabModified(tab);
                
                return (
                  <div 
                    class="tab" 
                    classList={{ active: isActive(), modified: isModified() }}
                    onClick={() => props.onTabSelect(tab.id)}
                  >
                    <span class="tab-name">{tab.name || 'Untitled'}</span>
                    <Show when={isModified()}>
                      <span class="tab-modified-dot">•</span>
                    </Show>
                    <button 
                      class="tab-close"
                      onClick={(e) => handleTabClose(e, tab.id)}
                      title="Close tab"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                );
              }}
            </For>
            <button class="new-tab-btn" onClick={() => props.onNewTab()} title="New tab (⌘T)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Two-column content area */}
      <div class="composer-content">
        <div class="composer-body">
          <textarea
            class="input input-mono composer-textarea"
            placeholder={
              format() === 'json'
                ? '{"message": "Hello, {{name}}!"}'
                : format() === 'binary'
                ? 'Enter hex bytes (e.g., 48 65 6c 6c 6f)'
                : 'Enter your message... Use {{variable}} for placeholders'
            }
            value={message()}
            onInput={(e) => handleMessageInput(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            classList={{ 'has-error': !!jsonError() }}
          />

          <Show when={jsonError()}>
            <div class="composer-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {jsonError()}
            </div>
          </Show>
        </div>

        <Show when={hasVariables()}>
          <div class="template-variables">
            <div class="variables-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
              <span>Variables</span>
            </div>
            <div class="variables-grid">
              <For each={detectedVariables()}>
                {(name) => (
                  <div class="variable-field">
                    <label class="variable-label">{`{{${name}}}`}</label>
                    <input
                      type="text"
                      class="input input-mono variable-input"
                      value={variableValues()[name] || ''}
                      onInput={(e) => handleVariableChange(name, e.currentTarget.value)}
                      placeholder={`Value for ${name}`}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>

      {/* Save Modal */}
      <SaveModal
        isOpen={showSaveModal()}
        collections={collections.collections}
        onSave={handleSaveNewTemplate}
        onCancel={() => setShowSaveModal(false)}
        onCreateCollection={addCollection}
      />

      <div class="composer-footer">
        <div class="composer-controls-left">
          {/* Save button for unsaved tabs */}
          <Show when={activeTab() && !activeTab()?.templateId && message().trim()}>
            <button
              class="btn btn-sm btn-save-tab"
              onClick={handleSaveClick}
              title="Save as template (⌘S)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </button>
          </Show>
          
          {/* Update button for modified template tabs */}
          <Show when={activeTab()?.templateId && isCurrentTabModified()}>
            <button
              class="btn btn-sm btn-update-tab"
              onClick={handleUpdateTemplate}
              title="Save changes (⌘S)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Update
            </button>
          </Show>

          <select
            class="select format-select"
            value={format()}
            onChange={(e) => handleFormatChange(e.currentTarget.value as MessageFormat)}
          >
            <option value="json">JSON</option>
            <option value="text">Text</option>
            <option value="binary">Binary</option>
          </select>

          <Show when={format() === 'json'}>
            <button
              class="btn-icon"
              onClick={handleFormatJson}
              disabled={!message().trim()}
              title="Prettify JSON"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
            </button>
          </Show>
        </div>

        <div class="composer-controls-right">
          <div class="composer-hints">
            <Show 
              when={hasVariables()}
              fallback={
                <span class="composer-hint hint-muted">
                  <code>{`{{var}}`}</code> for variables
                </span>
              }
            >
              <span class="composer-hint variable-hint">
                <Show 
                  when={!hasUnresolvedVariables()}
                  fallback={<span class="hint-warning">Fill in all variables</span>}
                >
                  <span class="hint-ready">Variables ready</span>
                </Show>
              </span>
            </Show>
            <span class="composer-hint hint-shortcut">
              <kbd>⌘</kbd><kbd>↵</kbd>
            </span>
          </div>
          <button
            class="btn btn-primary send-btn"
            onClick={handleSend}
            disabled={isDisabled() || !message().trim() || !!jsonError() || hasUnresolvedVariables()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
