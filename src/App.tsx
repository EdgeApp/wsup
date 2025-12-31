import { Component, createSignal, onMount, createEffect } from 'solid-js';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MessageComposer } from './components/MessageComposer/MessageComposer';
import { MessageLog } from './components/MessageLog/MessageLog';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { ConnectionProvider } from './stores/connections';
import { CollectionsProvider, MessageTemplate } from './stores/collections';
import { MessageFormat } from './stores/connections';
import { app, sidebar, sidebarFooter, mainPanel } from './styles/global.css';

// Tab represents an open message editor
export interface MessageTab {
  id: string;
  name: string;
  content: string;
  format: MessageFormat;
  variableValues: Record<string, string>;
  templateId?: string; // linked to saved template, undefined for unsaved drafts
  originalContent?: string; // for tracking modifications
  originalName?: string;
  originalFormat?: MessageFormat;
}

let tabIdCounter = 0;
const generateTabId = () => `tab-${++tabIdCounter}`;

const App: Component = () => {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('dark');
  const [tabs, setTabs] = createSignal<MessageTab[]>([]);
  const [activeTabId, setActiveTabId] = createSignal<string | null>(null);

  // Create initial tab on mount
  onMount(() => {
    const saved = localStorage.getItem('wsup-theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }

    // Create a default tab
    createNewTab();
  });

  const toggleTheme = () => {
    const newTheme = theme() === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('wsup-theme', newTheme);
  };

  // Get the active tab
  const activeTab = () => tabs().find(t => t.id === activeTabId()) || null;

  // Check if a tab is modified
  const isTabModified = (tab: MessageTab) => {
    if (tab.templateId) {
      return tab.content !== tab.originalContent || 
             tab.name !== tab.originalName || 
             tab.format !== tab.originalFormat;
    }
    // For unsaved tabs, consider modified if has content
    return tab.content.trim() !== '';
  };

  // Create a new empty tab
  const createNewTab = () => {
    const newTab: MessageTab = {
      id: generateTabId(),
      name: 'Untitled',
      content: '{"message": "Hello, {{name}}!"}',
      format: 'json',
      variableValues: {},
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  };

  // Open a template in a new tab (or focus existing)
  const openTemplateInTab = (template: MessageTemplate) => {
    // Check if template is already open
    const existingTab = tabs().find(t => t.templateId === template.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    // Create new tab from template
    const variableValues: Record<string, string> = {};
    if (template.variables) {
      template.variables.forEach(v => {
        variableValues[v.name] = v.defaultValue;
      });
    }

    const newTab: MessageTab = {
      id: generateTabId(),
      name: template.name,
      content: template.content,
      format: template.format,
      variableValues,
      templateId: template.id,
      originalContent: template.content,
      originalName: template.name,
      originalFormat: template.format,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  // Close a tab
  const closeTab = (tabId: string) => {
    const tabIndex = tabs().findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    setTabs(prev => prev.filter(t => t.id !== tabId));

    // If we closed the active tab, activate another
    if (activeTabId() === tabId) {
      const remaining = tabs().filter(t => t.id !== tabId);
      if (remaining.length > 0) {
        // Activate the tab before or after the closed one
        const newIndex = Math.min(tabIndex, remaining.length - 1);
        setActiveTabId(remaining[newIndex].id);
      } else {
        // No tabs left, create a new one
        createNewTab();
      }
    }
  };

  // Update the active tab's content
  const updateActiveTab = (updates: Partial<MessageTab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId() ? { ...tab, ...updates } : tab
    ));
  };

  // Mark tab as saved (update original values)
  const markTabAsSaved = (tabId: string, template: MessageTemplate) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? {
        ...tab,
        templateId: template.id,
        name: template.name,
        originalContent: template.content,
        originalName: template.name,
        originalFormat: template.format,
      } : tab
    ));
  };

  // Refresh tab from template (after external save)
  const refreshTabFromTemplate = (template: MessageTemplate) => {
    setTabs(prev => prev.map(tab => 
      tab.templateId === template.id ? {
        ...tab,
        originalContent: template.content,
        originalName: template.name,
        originalFormat: template.format,
      } : tab
    ));
  };

  return (
    <CollectionsProvider>
      <ConnectionProvider>
        <div class={app} data-theme={theme()}>
          <aside class={sidebar}>
            <Sidebar 
              onSelectTemplate={openTemplateInTab}
              activeTab={activeTab()}
            />
            <div class={sidebarFooter}>
              <ThemeToggle theme={theme()} onToggle={toggleTheme} />
            </div>
          </aside>
          <main class={mainPanel}>
            <MessageLog />
            <MessageComposer 
              tabs={tabs()}
              activeTabId={activeTabId()}
              onTabSelect={setActiveTabId}
              onTabClose={closeTab}
              onNewTab={createNewTab}
              onTabUpdate={updateActiveTab}
              onTabSaved={markTabAsSaved}
              isTabModified={isTabModified}
            />
          </main>
        </div>
      </ConnectionProvider>
    </CollectionsProvider>
  );
};

export default App;
