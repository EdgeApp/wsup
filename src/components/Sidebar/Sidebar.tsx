import { Component, For, Show, createSignal } from 'solid-js';
import { useCollections, MessageTemplate } from '../../stores/collections';
import { useConnection, Connection } from '../../stores/connections';
import { MessageFormat } from '../../stores/connections';
import { MessageTab } from '../../App';
import './Sidebar.css';

interface SidebarProps {
  onSelectTemplate: (template: MessageTemplate) => void;
  activeTab: MessageTab | null;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  const { 
    state: collections, 
    addCollection, 
    toggleCollection,
    expandCollection,
    addTemplate,
    removeTemplate,
    updateTemplate,
  } = useCollections();

  const {
    state: connectionState,
    selectedConnection,
    addConnection,
    removeConnection,
    selectConnection,
    connect,
    disconnect,
  } = useConnection();
  
  const [showNewCollection, setShowNewCollection] = createSignal(false);
  const [newCollectionName, setNewCollectionName] = createSignal('');
  const [showNewConnection, setShowNewConnection] = createSignal(false);
  const [newConnectionUrl, setNewConnectionUrl] = createSignal('wss://');
  const [creatingTemplateInCollection, setCreatingTemplateInCollection] = createSignal<string | null>(null);
  const [newTemplateName, setNewTemplateName] = createSignal('Untitled');
  const [renamingTemplate, setRenamingTemplate] = createSignal<{ collectionId: string; templateId: string } | null>(null);
  const [renameValue, setRenameValue] = createSignal('');
  
  let newTemplateInputRef: HTMLInputElement | undefined;
  let renameInputRef: HTMLInputElement | undefined;

  const handleCreateCollection = () => {
    const name = newCollectionName().trim();
    if (!name) return;
    addCollection(name);
    setNewCollectionName('');
    setShowNewCollection(false);
  };

  const handleSelectTemplate = (template: MessageTemplate) => {
    props.onSelectTemplate(template);
  };

  const handleStartCreateTemplate = (collectionId: string) => {
    expandCollection(collectionId);
    setCreatingTemplateInCollection(collectionId);
    setNewTemplateName('Untitled');
    // Focus the input after it renders
    setTimeout(() => {
      newTemplateInputRef?.focus();
      newTemplateInputRef?.select();
    }, 0);
  };

  const handleSaveNewTemplate = (collectionId: string) => {
    const name = newTemplateName().trim();
    if (!name) return;
    
    addTemplate(collectionId, {
      name,
      content: '{"message": "Hello, World!"}',
      format: 'json',
      variables: [],
    });
    
    setCreatingTemplateInCollection(null);
    setNewTemplateName('Untitled');
  };

  const handleCancelCreateTemplate = () => {
    setCreatingTemplateInCollection(null);
    setNewTemplateName('Untitled');
  };

  const handleStartRename = (collectionId: string, template: MessageTemplate) => {
    setRenamingTemplate({ collectionId, templateId: template.id });
    setRenameValue(template.name);
    // Focus the input after it renders
    setTimeout(() => {
      renameInputRef?.focus();
      renameInputRef?.select();
    }, 0);
  };

  const handleSaveRename = () => {
    const renaming = renamingTemplate();
    if (!renaming) return;
    
    const name = renameValue().trim();
    if (name) {
      updateTemplate(renaming.collectionId, renaming.templateId, { name });
    }
    setRenamingTemplate(null);
    setRenameValue('');
  };

  const handleCancelRename = () => {
    setRenamingTemplate(null);
    setRenameValue('');
  };

  const handleAddConnection = () => {
    const url = newConnectionUrl().trim();
    if (!url) return;
    const id = addConnection(url);
    setNewConnectionUrl('wss://');
    setShowNewConnection(false);
    // Auto-connect the new connection
    connect(id);
  };

  const handleConnectionClick = (conn: Connection) => {
    selectConnection(conn.id);
  };

  const handleToggleConnection = (e: Event, conn: Connection) => {
    e.stopPropagation();
    if (conn.status === 'connected' || conn.status === 'connecting') {
      disconnect(conn.id);
    } else {
      connect(conn.id);
    }
  };

  const handleRemoveConnection = (e: Event, id: string) => {
    e.stopPropagation();
    removeConnection(id);
  };

  const getFormatBadgeClass = (format: MessageFormat) => {
    switch (format) {
      case 'json': return 'format-json';
      case 'text': return 'format-text';
      case 'binary': return 'format-binary';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'connected': return 'status-connected';
      case 'connecting': return 'status-connecting';
      case 'error': return 'status-error';
      default: return 'status-disconnected';
    }
  };

  const getHostname = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return url;
    }
  };

  // Check if a template is currently open in a tab
  const isTemplateOpen = (templateId: string) => {
    return props.activeTab?.templateId === templateId;
  };

  // Window control handlers for Pear/Electron
  const handleMinimize = () => {
    try {
      // Try Pear API first (pear-electron exposes Pear.gui)
      // @ts-ignore
      if (window.Pear?.gui?.minimize) {
        // @ts-ignore
        window.Pear.gui.minimize();
        return;
      }
      // Try electron ipcRenderer
      // @ts-ignore
      const { ipcRenderer } = window.require?.('electron') || {};
      if (ipcRenderer) {
        ipcRenderer.send('minimize');
        return;
      }
    } catch (e) {
      // Not in Pear/Electron environment
    }
  };

  const handleMaximize = () => {
    try {
      // Try Pear API first
      // @ts-ignore
      if (window.Pear?.gui?.maximize) {
        // @ts-ignore
        window.Pear.gui.maximize();
        return;
      }
      // Try electron ipcRenderer
      // @ts-ignore
      const { ipcRenderer } = window.require?.('electron') || {};
      if (ipcRenderer) {
        ipcRenderer.send('maximize');
        return;
      }
    } catch (e) {
      // Not in Pear/Electron environment
    }
    // Web fallback: toggle fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleClose = () => {
    try {
      // Try Pear API first
      // @ts-ignore
      if (window.Pear?.gui?.close) {
        // @ts-ignore
        window.Pear.gui.close();
        return;
      }
      // Try electron ipcRenderer
      // @ts-ignore
      const { ipcRenderer } = window.require?.('electron') || {};
      if (ipcRenderer) {
        ipcRenderer.send('close');
        return;
      }
    } catch (e) {
      // Not in Pear/Electron environment
    }
    // Web fallback
    window.close();
  };

  return (
    <div class="sidebar-content">
      <div class="sidebar-header">
        <div class="window-controls">
          <button class="window-btn close" onClick={handleClose} title="Close">
            <span class="window-btn-icon" />
          </button>
          <button class="window-btn minimize" onClick={handleMinimize} title="Minimize">
            <span class="window-btn-icon" />
          </button>
          <button class="window-btn maximize" onClick={handleMaximize} title="Maximize">
            <span class="window-btn-icon" />
          </button>
        </div>
        <div class="sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="2"></circle>
          </svg>
          <span class="logo-text">WSup</span>
        </div>
      </div>

      <Show when={showNewCollection()}>
        <div class="new-collection-form">
          <input
            type="text"
            class="input"
            placeholder="Collection name"
            value={newCollectionName()}
            onInput={(e) => setNewCollectionName(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
            autofocus
          />
          <div class="form-actions">
            <button class="btn btn-secondary btn-sm" onClick={() => setShowNewCollection(false)}>
              Cancel
            </button>
            <button class="btn btn-primary btn-sm" onClick={handleCreateCollection}>
              Create
            </button>
          </div>
        </div>
      </Show>

      <div class="sidebar-section templates-section">
        <div class="section-header">
          <span>Message Templates</span>
          <button
            class="btn-icon btn-sm"
            onClick={() => setShowNewCollection(true)}
            title="New collection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        <div class="collections-list">
          <For each={collections.collections}>
            {(collection) => (
              <div class="collection" classList={{ expanded: collection.isExpanded }}>
                <div
                  class="collection-header"
                  onClick={() => toggleCollection(collection.id)}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="collection-chevron"
                    classList={{ expanded: collection.isExpanded }}
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span class="collection-name">{collection.name}</span>
                  <button
                    class="btn-icon btn-sm collection-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCreateTemplate(collection.id);
                    }}
                    title="Add template"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>

                <Show when={collection.isExpanded}>
                  <div class="collection-items">
                    {/* New template inline input */}
                    <Show when={creatingTemplateInCollection() === collection.id}>
                      <div class="template-item new-template-item">
                        <input
                          ref={newTemplateInputRef}
                          type="text"
                          class="template-name-input"
                          value={newTemplateName()}
                          onInput={(e) => setNewTemplateName(e.currentTarget.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveNewTemplate(collection.id);
                            } else if (e.key === 'Escape') {
                              handleCancelCreateTemplate();
                            }
                          }}
                          onBlur={() => {
                            // Save on blur if there's content, otherwise cancel
                            if (newTemplateName().trim()) {
                              handleSaveNewTemplate(collection.id);
                            } else {
                              handleCancelCreateTemplate();
                            }
                          }}
                          placeholder="Template name"
                        />
                      </div>
                    </Show>
                    <For each={collection.templates}>
                      {(template) => {
                        const isRenaming = () => renamingTemplate()?.templateId === template.id;
                        const isOpen = () => isTemplateOpen(template.id);
                        
                        return (
                          <div
                            class="template-item"
                            classList={{ open: isOpen() }}
                            onClick={() => {
                              if (isRenaming()) return;
                              // Open the template (or focus if already open)
                              handleSelectTemplate(template);
                            }}
                            onDblClick={() => {
                              if (isRenaming()) return;
                              // Double-click to rename
                              handleStartRename(collection.id, template);
                            }}
                            title={isRenaming() ? undefined : `Click to open, double-click to rename`}
                          >
                            <div class="template-info">
                              <Show 
                                when={isRenaming()}
                                fallback={
                                  <span class="template-name">
                                    {template.name}
                                  </span>
                                }
                              >
                                <input
                                  ref={renameInputRef}
                                  type="text"
                                  class="template-name-input"
                                  value={renameValue()}
                                  onInput={(e) => setRenameValue(e.currentTarget.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleSaveRename();
                                    } else if (e.key === 'Escape') {
                                      handleCancelRename();
                                    }
                                  }}
                                  onBlur={() => {
                                    if (renameValue().trim()) {
                                      handleSaveRename();
                                    } else {
                                      handleCancelRename();
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  onDblClick={(e) => e.stopPropagation()}
                                />
                              </Show>
                              <span class={`template-format ${getFormatBadgeClass(template.format)}`}>
                                {template.format.toUpperCase()}
                              </span>
                            </div>
                            <Show when={template.variables && template.variables.length > 0}>
                              <div class="template-vars">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                {template.variables.length} var{template.variables.length > 1 ? 's' : ''}
                              </div>
                            </Show>
                            <button
                              class="item-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTemplate(collection.id, template.id);
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        );
                      }}
                    </For>
                    
                    <Show when={collection.templates.length === 0}>
                      <div class="empty-collection">
                        <span>No templates yet</span>
                      </div>
                    </Show>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="sidebar-section connections-section">
        <div class="section-header">
          <span>Connections</span>
          <button
            class="btn-icon btn-sm"
            onClick={() => setShowNewConnection(true)}
            title="New connection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <div class="connections-list">
          <Show when={showNewConnection()}>
            <div class="new-connection-form">
              <input
                type="text"
                class="input input-mono"
                placeholder="wss://example.com/socket"
                value={newConnectionUrl()}
                onInput={(e) => setNewConnectionUrl(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddConnection();
                  if (e.key === 'Escape') setShowNewConnection(false);
                }}
                autofocus
              />
              <div class="form-actions">
                <button class="btn btn-secondary btn-sm" onClick={() => setShowNewConnection(false)}>
                  Cancel
                </button>
                <button class="btn btn-primary btn-sm" onClick={handleAddConnection}>
                  Connect
                </button>
              </div>
            </div>
          </Show>

          <Show
            when={connectionState.connections.length > 0}
            fallback={
              <Show when={!showNewConnection()}>
                <div class="empty-state">
                  <span>No connections yet</span>
                </div>
              </Show>
            }
          >
            <For each={connectionState.connections}>
              {(conn) => (
                <div
                  class="connection-item"
                  classList={{ 
                    selected: connectionState.selectedId === conn.id,
                    connected: conn.status === 'connected'
                  }}
                  onClick={() => handleConnectionClick(conn)}
                  title={conn.url}
                >
                  <div class="connection-info">
                    <span class={`connection-status-dot ${getStatusClass(conn.status)}`}></span>
                    <span class="connection-url mono">{getHostname(conn.url)}</span>
                  </div>
                  <div class="connection-actions">
                    <button
                      class="btn-icon btn-xs"
                      onClick={(e) => handleToggleConnection(e, conn)}
                      title={conn.status === 'connected' ? 'Disconnect' : 'Connect'}
                    >
                      {conn.status === 'connected' || conn.status === 'connecting' ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="6" y="6" width="12" height="12" rx="2"></rect>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      )}
                    </button>
                    <button
                      class="btn-icon btn-xs btn-danger-hover"
                      onClick={(e) => handleRemoveConnection(e, conn.id)}
                      title="Remove connection"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
};
