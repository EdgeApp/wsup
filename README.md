# WSup - WebSocket Testing Application

A Postman-style desktop application for testing WebSocket connections, built with SolidJS and Pear runtime.

## Features

- **Single Active Connection**: One WebSocket connection at the top with real-time status indicators
- **Message Templates**: Save and organize message templates in collections for quick reuse
- **Template Variables**: Use `{{variable}}` syntax in templates for dynamic values
- **Message Formats**: Support for JSON (with validation), Plain Text, and Binary
- **Connection History**: Automatically track recently used WebSocket URLs
- **Dual Themes**: Beautiful light and dark modes with smooth transitions
- **Desktop Experience**: Native desktop app via Pear runtime with pear-electron

## Tech Stack

- **Runtime**: [Pear](https://docs.pears.com/) with pear-electron
- **UI Framework**: [SolidJS](https://solidjs.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Pear](https://docs.pears.com/guides/getting-started) installed

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start Vite dev server (browser testing)
bun run dev

# Run with Pear in development mode (hot reload)
bun run pear:dev
```

### Building

```bash
# Build for production
bun run build
```

### Pear Commands

```bash
# Run the app with Pear (development mode with hot reload)
bun run pear:dev

# Run the built app with Pear
bun run pear:run

# Stage the app for Pear distribution
bun run pear:stage

# Release the app to Pear network
bun run pear:release
```

## Project Structure

```
wsup/
├── package.json          # Pear + dependencies config
├── index.html            # Entry HTML
├── vite.config.ts        # Vite build config
├── src/
│   ├── index.tsx         # App entry
│   ├── App.tsx           # Root component
│   ├── styles/
│   │   ├── global.css    # Global styles + utilities
│   │   └── themes.css    # Light/dark theme variables
│   ├── components/
│   │   ├── Sidebar/      # Message templates + history
│   │   ├── ConnectionPanel/  # URL input, connect/disconnect
│   │   ├── MessageComposer/  # Message input with templates
│   │   ├── MessageLog/       # Timestamped message display
│   │   └── ThemeToggle/      # Light/dark switch
│   ├── stores/
│   │   ├── connections.tsx   # Active WebSocket state
│   │   └── collections.tsx   # Message templates (localStorage)
│   └── utils/
│       └── formatters.ts     # Utility functions
└── dist/                 # Built output for Pear
```

## Pear Configuration

The app uses Pear's `links` configuration to allow WebSocket connections to any server:

```json
{
  "pear": {
    "name": "wsup",
    "links": [
      "ws://*",
      "wss://*",
      "http://*",
      "https://*"
    ]
  }
}
```

## Usage

### Basic Workflow

1. **Connect**: Enter a WebSocket URL (e.g., `wss://echo.websocket.org`) and click Connect
2. **Compose**: Type your message in the composer or select a template
3. **Send**: Click Send or use `⌘/Ctrl + Enter`
4. **View**: See sent and received messages in the log with timestamps

### Message Templates

Templates let you save frequently used messages for quick access:

1. **Create Template**: Type a message, click the save icon, and add it to a collection
2. **Use Template**: Click any template in the sidebar to load it
3. **Template Variables**: Use `{{variableName}}` syntax for dynamic values

Example template with variables:
```json
{
  "action": "subscribe",
  "channel": "{{channel}}",
  "user": "{{username}}"
}
```

When you select this template, input fields appear for each variable.

### Collections

Organize your templates into collections:

1. Click the `+` button in the sidebar header
2. Name your collection
3. Add templates using the "Add template" button

## Keyboard Shortcuts

- `⌘/Ctrl + Enter` - Send message
- `Enter` (in URL field) - Connect

## License

MIT
