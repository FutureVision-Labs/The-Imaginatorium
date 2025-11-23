# 🚀 Quick Start Guide: The Imaginatorium

## Running The Imaginatorium

### Option 1: Browser Mode (With Graphics)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local server:**
   ```bash
   npm run browser
   ```
   This will start a local web server on `http://localhost:8080`

3. **Open in browser:**
   - Navigate to `http://localhost:8080`
   - Click "Start" to initialize The Imaginatorium
   - You should see the Phaser game scene with placeholder graphics!

### Option 2: Headless Mode (No Graphics)

1. **Run directly:**
   ```bash
   npm start
   ```
   This runs The Imaginatorium in headless mode (no graphics, just the backend systems)

## Current Status

✅ **Completed:**
- Core systems (WorldStateManager, EventSystem, CMLParser, NarrativeRenderer)
- Agent base class
- Phaser game scene setup
- Browser entry point

🚧 **In Progress:**
- Voxel asset loading
- Character rendering
- Room rendering

📋 **Next Steps:**
1. Load actual voxel assets from `assets/voxel/` folders
2. Create character sprites and animations
3. Implement room layouts
4. Connect AI agents to visual representation

## File Structure

```
TheImaginatorium/
├── src/
│   ├── main.js              # Main entry point (Node.js)
│   ├── main-browser.js      # Browser entry point
│   ├── core/                # Core systems
│   ├── agents/              # AI agent classes
│   ├── world/               # Phaser game scenes
│   └── narrative/           # Narrative rendering
├── assets/
│   └── voxel/               # Voxel assets (characters, rooms, furniture)
├── data/                    # Database and logs
└── index.html               # Browser UI

```

## Development Notes

- **Phaser.js** is loaded from CDN for browser mode
- **SQLite** database is created in `data/` folder
- **Event logs** are stored in `data/events/` as compressed markup
- **Character journals** are stored in `data/journals/`

## Troubleshooting

**"Phaser not loaded" error:**
- Make sure you're accessing via `http://localhost:8080` (not `file://`)
- Check browser console for errors

**"Cannot find module" error:**
- Run `npm install` to install dependencies

**Game not rendering:**
- Check browser console for Phaser errors
- Make sure the `imaginatorium-game` div exists in the HTML

---

**Ready to build The Imaginatorium!** 🌟 <3 :D 8)

