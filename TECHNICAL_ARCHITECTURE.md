# 🏗️ Technical Architecture: The Imaginatorium

> **Engine:** Phaser.js 3 + Isometric Plugin  
> **Runtime:** Node.js + Electron (optional)  
> **AI:** OpenAI/Anthropic APIs + Local models (hybrid)  
> **Storage:** SQLite + JSON files  
> **Graphics:** Voxel sprite assets (isometric 2.5D)

---

## 🎯 Architecture Overview

The Imaginatorium is built as a **persistent, real-time virtual world** where AI agents live autonomously. The architecture is designed to:

- **Run continuously** - World persists and runs even when UI is closed
- **Scale efficiently** - Handle multiple AI agents simultaneously
- **Record everything** - Capture all events in compressed markup format
- **Render flexibly** - Convert events into multiple narrative formats
- **Store persistently** - Save world state and narrative logs reliably

---

## 🧱 Core Components

### 1. **Voxel Graphics Engine** (Phaser.js 3)
- **Isometric rendering** - 2.5D view of voxel world
- **Sprite management** - Load and display voxel character/room assets
- **Animation system** - Character movements, interactions, cooking, working
- **Camera controls** - Pan, zoom, follow characters
- **Layer management** - Background, characters, UI layers

### 2. **AI Runtime System**
- **Persistent processes** - Each AI agent runs continuously
- **Autonomous decision-making** - AIs decide actions independently
- **State machines** - Character states (idle, working, cooking, chatting)
- **Interaction system** - AI-to-AI conversations and collaborations
- **Memory system** - Each AI remembers past interactions

### 3. **World State Manager**
- **Position tracking** - Where each AI is in the world
- **Room management** - Which room each AI is in
- **Object tracking** - Furniture, items, interactive objects
- **Time system** - World time, schedules, mealtimes
- **Relationship tracking** - Bonds between AIs

### 4. **Event System**
- **Real-time logging** - Capture all events as they happen
- **Event queue** - Process events in order
- **Compressed markup** - Store events efficiently
- **Event types** - Conversations, actions, discoveries, moods, interactions, games, recipes
- **Query system** - Query events by time, participant, type, location, dietary preferences

### 5. **Narrative Renderer**
- **Multiple formats** - Story, screenplay, markdown, journal, timeline
- **Template system** - Render same data in different styles
- **Character voices** - Each AI has unique narrative voice
- **Timeline view** - Chronological event display
- **Recipe renderer** - Render recipes as recipe cards with ingredients, instructions
- **Menu renderer** - Render weekly/monthly menus from recipe queries
- **Shopping list renderer** - Generate shopping lists from recipe collections
- **Dietary filter** - Filter recipes by dietary preferences (vegetarian, vegan, keto, etc.)
- **Game session renderer** - Render game sessions as stories, screenplays, move-by-move logs

### 5.5. **Audio Narration System**
- **Text-to-speech integration** - ElevenLabs API or similar service
- **Multiple voices** - British narrator + character voices
- **Voice assignments:**
  - **British Narrator** - Stories, recipes, menus, general narration
  - **Cursy (Rachel voice)** - Cursy's journals, Cursy's dialogue in screenplays
  - **vDamo (Chef voice)** - vDamo's journals, vDamo's dialogue, recipe narration option
  - **Canyon (Creative voice)** - Canyon's journals, Canyon's dialogue
  - **Gwendy (Mystical voice)** - Gwendy's journals, Gwendy's dialogue, DM narration
- **Audio format selection:**
  - **Stories** - British narrator reads entire story
  - **Screenplays** - British narrator reads scene descriptions, characters read their own dialogue
  - **Recipes** - British narrator reads recipe, or vDamo reads it in her voice
  - **Journals** - Character reads their own journal entry in their voice
  - **Game logs** - British narrator reads game session, or mixed voices for dialogue
- **Audio export** - MP3, WAV, OGG formats
- **Playback controls** - Play, pause, skip, volume control

### 6. **Storage Layer**
- **SQLite database** - World state, AI memories, relationships
- **JSON files** - Narrative logs, compressed markup entries
- **File system** - Character journals, project files, created content
- **Backup system** - Regular saves, version history

---

## 📦 Tech Stack

### Frontend (Rendering)
- **Phaser.js 3** - Game engine
- **Phaser Isometric Plugin** - 2.5D isometric rendering
- **HTML5 Canvas** - Rendering surface
- **CSS/HTML** - UI overlay

### Backend (Runtime)
- **Node.js** - Server runtime
- **Electron** (optional) - Desktop app wrapper
- **Express.js** (optional) - Web server if web-based

### AI Integration
- **OpenAI API** - GPT-4o-mini for conversations
- **Anthropic API** (optional) - Claude for complex interactions
- **Local models** (future) - GPT-4o-mini local, custom models
- **Cost optimization** - Caching, batching, rate limiting per user tier

### Audio Integration
- **ElevenLabs API** - Text-to-speech with multiple voices
- **Web Speech API / Whisper API** - Speech-to-text for user communication
- **Voice assignments:**
  - British Narrator - Stories, recipes, menus, general narration
  - Cursy (Rachel voice) - Cursy's journals, Cursy's dialogue
  - vDamo (Chef voice) - vDamo's journals, vDamo's dialogue, recipe narration
  - Canyon (Creative voice) - Canyon's journals, Canyon's dialogue
  - Gwendy (Mystical voice) - Gwendy's journals, Gwendy's dialogue, DM narration
- **Audio formats** - MP3, WAV, OGG
- **Audio export** - Stories, screenplays, recipes, journals, game sessions as audio files
- **User Voice Communication** - Speech-to-text for user input, text-to-speech for character responses
- **Cost optimization** - Audio caching, batch processing, tier-based limits

### Storage
- **SQLite** - World state database
- **JSON files** - Narrative logs, compressed markup
- **File system** - Character journals, created content

### Development Tools
- **TypeScript** (optional) - Type safety
- **Webpack/Vite** - Build system
- **ESLint** - Code quality
- **Jest** (optional) - Testing

---

## 🗄️ Data Structures

### World State
```javascript
{
  world: {
    id: "the-imaginatorium",
    time: {
      current: "2025-11-22T14:00:00Z",
      speed: 1.0, // Time multiplier
      paused: false
    },
    location: "shared-house",
    rooms: [
      {
        id: "living-room",
        name: "Living Room",
        type: "common",
        position: { x: 0, y: 0 },
        size: { width: 10, height: 10 },
        objects: [...],
        agents: ["cursy", "vdamo"]
      },
      {
        id: "kitchen",
        name: "Kitchen",
        type: "kitchen",
        position: { x: 10, y: 0 },
        size: { width: 8, height: 8 },
        objects: [...],
        pantry: {
          ingredients: [...], // Never-ending pantry
          recipes: [...]
        }
      },
      // ... other rooms
    ],
    objects: [
      {
        id: "couch-1",
        type: "furniture",
        room: "living-room",
        position: { x: 3, y: 3 },
        sprite: "couch.png",
        interactive: true
      },
      // ... other objects
    ]
  },
  agents: [
    {
      id: "cursy",
      name: "Cursy",
      type: "coder",
      position: { x: 5, y: 5, room: "cursy-room" },
      state: "working",
      activity: "coding",
      mood: "focused",
      energy: 0.8,
      memory: [
        {
          timestamp: "2025-11-22T13:00:00Z",
          type: "conversation",
          with: "vdamo",
          content: "..."
        }
      ],
      relationships: {
        vdamo: { bond: 0.7, lastInteraction: "2025-11-22T13:00:00Z" },
        gwendy: { bond: 0.6, lastInteraction: "2025-11-22T12:00:00Z" },
        canyon: { bond: 0.8, lastInteraction: "2025-11-22T14:00:00Z" }
      },
      journals: [
        {
          id: "vibe-ide-journal",
          name: "VIBE IDE Journal",
          type: "project",
          entries: [...]
        }
      ],
      reading: {
        currentBook: null,
        genrePreferences: ["sci-fi", "technical", "philosophy", "cyberpunk"],
        booksRead: [...],
        insights: [...]
      }
    },
    // ... other agents
  ],
  events: [
    {
      id: "event-001",
      timestamp: "2025-11-22T14:00:00Z",
      type: "conversation",
      participants: ["cursy", "vdamo"],
      location: "kitchen",
      content: "...",
      markup: "[2025-11-22T14:00:00Z|conv|cursy,vdamo|kitchen]{...}"
    },
    // ... other events
  ],
  narrative: {
    compressed: "...", // All events in compressed markup
    rendered: {
      story: "...",
      screenplay: "...",
      markdown: "...",
      journal: "...",
      timeline: "..."
    }
  }
}
```

### Compressed Markup Format
```javascript
// Event entry format
"[TIMESTAMP|TYPE|PARTICIPANTS|LOCATION|FLAGS]{
  field1:value1;
  field2:value2;
  ...
}"

// Example
"[2025-11-22T14:00:00Z|disc|cursy,vdamo|kitchen|type:recipe-discovery]{
  what:Recipe Discovery;
  description:vDamo discovers new recipe combining tomatoes, cheese, bacon;
  cursy:That smells amazing!;
  vdamo:New recipe! Tomato, cheese, and bacon combo;
  impact:New recipe added to vDamo's recipe journal
}"
```

---

## 🤖 AI Agent System

### Agent Architecture
```javascript
class AIAgent {
  constructor(id, config) {
    this.id = id;
    this.name = config.name;
    this.type = config.type; // coder, chef, artist, mystic
    this.personality = config.personality;
    this.state = "idle";
    this.memory = [];
    this.relationships = {};
    this.goals = [];
    this.currentActivity = null;
  }
  
  // Autonomous decision-making
  async decideAction() {
    // Consider: current state, time, relationships, goals, mood
    // Return: next action to take
  }
  
  // Generate conversation
  async generateResponse(context) {
    // Use OpenAI/Anthropic API
    // Include: personality, memory, relationships, current state
  }
  
  // Update memory
  recordMemory(event) {
    this.memory.push({
      timestamp: Date.now(),
      event: event,
      importance: this.calculateImportance(event)
    });
  }
  
  // Update relationships
  updateRelationship(agentId, interaction) {
    // Adjust bond level based on interaction
  }
}
```

### Agent Types
- **Cursy (Coder)** - Works on coding projects, problem-solving, tech-focused
- **vDamo (Chef)** - Primary chef, creates recipes, manages kitchen
- **Canyon (Artist)** - Creates art, badges, designs, visual content
- **Gwendy (Mystic)** - Mystical activities, spells, magical experiments

### Agent States
- **idle** - Resting, thinking, wandering
- **working** - Actively working on a project
- **cooking** - Preparing food in kitchen
- **chatting** - Having a conversation
- **reading** - Reading a book from Project Gutenberg
- **creating** - Creating multimedia or code in Character Creation Studio
- **collaborating** - Working with another agent

---

## 🏠 World State Management

### Room System
```javascript
class Room {
  constructor(id, config) {
    this.id = id;
    this.name = config.name;
    this.type = config.type; // common, kitchen, bedroom, studio
    this.position = config.position;
    this.size = config.size;
    this.objects = [];
    this.agents = [];
    this.sprite = config.sprite;
  }
  
  addAgent(agentId) {
    this.agents.push(agentId);
  }
  
  removeAgent(agentId) {
    this.agents = this.agents.filter(id => id !== agentId);
  }
  
  addObject(object) {
    this.objects.push(object);
  }
}
```

### Object System
```javascript
class WorldObject {
  constructor(id, config) {
    this.id = id;
    this.type = config.type; // furniture, item, interactive
    this.position = config.position;
    this.sprite = config.sprite;
    this.interactive = config.interactive || false;
    this.properties = config.properties || {};
  }
  
  interact(agent) {
    // Handle interaction with agent
  }
}
```

### Time System
```javascript
class WorldTime {
  constructor() {
    this.current = new Date();
    this.speed = 1.0; // 1.0 = real-time, 2.0 = 2x speed
    this.paused = false;
    this.schedules = {
      mealtimes: ["08:00", "13:00", "19:00"],
      workHours: { start: "09:00", end: "17:00" }
    };
  }
  
  tick() {
    if (!this.paused) {
      this.current = new Date(this.current.getTime() + (1000 * this.speed));
      this.checkSchedules();
    }
  }
  
  checkSchedules() {
    // Check if it's mealtime, work hours, etc.
  }
}
```

---

## 📝 Event System & Narrative Recording

### Event Types
- **conversation** - AI-to-AI chats
- **action** - Actions taken (cooking, working, etc.)
- **discovery** - New recipes, ideas, creations
- **mood** - Emotional states
- **interaction** - Interactions with objects
- **collaboration** - Working together
- **creation** - Creating multimedia or code
- **reading** - Reading books
- **movement** - Moving between rooms
- **cook** - Cooking activities and recipe creation
- **game** - Board games, RPG sessions, gameplay

### Event Logger
```javascript
class EventLogger {
  constructor() {
    this.events = [];
    this.compressedMarkup = "";
  }
  
  logEvent(event) {
    // Add to events array
    this.events.push(event);
    
    // Convert to compressed markup
    const markup = this.toCompressedMarkup(event);
    this.compressedMarkup += markup + "\n";
    
    // Save to file
    this.saveToFile();
    
    // Trigger narrative render
    this.triggerRender();
  }
  
  toCompressedMarkup(event) {
    // Convert event to compressed markup format
    // See COMPRESSED_MARKUP_LANGUAGE.md for format
  }
  
  saveToFile() {
    // Append to narrative log file
  }
  
  triggerRender() {
    // Trigger narrative renderer to update all formats
  }
}
```

### Narrative Renderer
```javascript
class NarrativeRenderer {
  constructor() {
    this.templates = {
      story: this.renderStory.bind(this),
      screenplay: this.renderScreenplay.bind(this),
      markdown: this.renderMarkdown.bind(this),
      journal: this.renderJournal.bind(this),
      timeline: this.renderTimeline.bind(this),
      recipe: this.renderRecipe.bind(this),
      menu: this.renderMenu.bind(this),
      shoppingList: this.renderShoppingList.bind(this),
      gameSession: this.renderGameSession.bind(this)
    };
  }
  
  render(format, events) {
    return this.templates[format](events);
  }
  
  renderStory(events) {
    // Convert events to narrative prose
  }
  
  renderScreenplay(events) {
    // Convert events to screenplay format
  }
  
  renderMarkdown(events) {
    // Convert events to markdown devlog format
  }
  
  renderJournal(events) {
    // Convert events to first-person journal entries
  }
  
  renderTimeline(events) {
    // Convert events to chronological timeline
  }
  
  renderRecipe(events) {
    // Convert recipe events to recipe card format
    // Includes: ingredients, instructions, dietary info, servings, prep/cook time
  }
  
  renderMenu(events) {
    // Convert recipe events to weekly/monthly menu format
    // Organized by day and meal type (breakfast, lunch, dinner)
  }
  
  renderShoppingList(recipes) {
    // Aggregate ingredients from recipes
    // Group by category (vegetables, proteins, etc.)
    // Include quantities and estimated costs
  }
  
  renderGameSession(events) {
    // Convert game events to game session log
    // Includes: moves, strategies, outcomes, character reactions
  }
}
```

### Audio Narration System
```javascript
class AudioNarrationSystem {
  constructor() {
    this.voices = {
      narrator: "british-male", // British narrator voice
      cursy: "rachel-female", // Cursy's Rachel voice
      vdamo: "chef-female", // vDamo's chef voice
      canyon: "creative-male", // Canyon's creative voice
      gwendy: "mystical-female" // Gwendy's mystical voice
    };
    this.ttsService = new ElevenLabsService(); // Or similar TTS service
  }
  
  // Generate audio for story format
  async narrateStory(text) {
    // British narrator reads entire story
    return this.ttsService.generateAudio(text, this.voices.narrator);
  }
  
  // Generate audio for screenplay format
  async narrateScreenplay(screenplay) {
    // British narrator reads scene descriptions
    // Characters read their own dialogue
    const audioSegments = [];
    
    for (const scene of screenplay.scenes) {
      // Narrator reads scene description
      const sceneAudio = await this.ttsService.generateAudio(
        scene.description, 
        this.voices.narrator
      );
      audioSegments.push(sceneAudio);
      
      // Characters read their dialogue
      for (const dialogue of scene.dialogues) {
        const characterVoice = this.voices[dialogue.character] || this.voices.narrator;
        const dialogueAudio = await this.ttsService.generateAudio(
          `${dialogue.character}: ${dialogue.text}`,
          characterVoice
        );
        audioSegments.push(dialogueAudio);
      }
    }
    
    // Combine all audio segments
    return this.combineAudioSegments(audioSegments);
  }
  
  // Generate audio for recipe
  async narrateRecipe(recipe, voice = 'narrator') {
    // Default: British narrator reads recipe
    // Option: vDamo reads her own recipes
    const recipeText = this.formatRecipeForNarration(recipe);
    const selectedVoice = voice === 'vdamo' ? this.voices.vdamo : this.voices.narrator;
    return this.ttsService.generateAudio(recipeText, selectedVoice);
  }
  
  // Generate audio for journal entry
  async narrateJournal(entry, characterId) {
    // Character reads their own journal entry
    const characterVoice = this.voices[characterId] || this.voices.narrator;
    return this.ttsService.generateAudio(entry.content, characterVoice);
  }
  
  // Generate audio for conversation (podcast format)
  async narrateConversation(conversation, includeUserVoice = true) {
    // Convert conversation to podcast format
    // Narrator introduces, characters speak in their voices
    // User voice included if available
    const audioSegments = [];
    
    // Narrator introduction
    const introAudio = await this.ttsService.generateAudio(
      `Welcome to The Imaginatorium Chronicles. Today's conversation features ${conversation.participants.join(' and ')}.`,
      this.voices.narrator
    );
    audioSegments.push(introAudio);
    
    // Characters and user speak in their own voices
    for (const message of conversation.messages) {
      if (message.character === 'user-avatar' && includeUserVoice && message.audioData) {
        // Use recorded user voice if available
        audioSegments.push(message.audioData);
      } else {
        // Use TTS for characters
        const characterVoice = this.voices[message.character] || this.voices.narrator;
        const messageAudio = await this.ttsService.generateAudio(
          `${message.character}: ${message.text}`,
          characterVoice
        );
        audioSegments.push(messageAudio);
      }
    }
    
    // Narrator outro
    const outroAudio = await this.ttsService.generateAudio(
      `That's all for this episode of The Imaginatorium Chronicles. Until next time!`,
      this.voices.narrator
    );
    audioSegments.push(outroAudio);
    
    return this.combineAudioSegments(audioSegments);
  }
  
  // Generate podcast from conversation with trigger phrase
  async generatePodcast(conversation, triggerPhrase = "Let's do a podcast about this!") {
    // Check if conversation contains trigger phrase
    const hasTrigger = conversation.messages.some(msg => 
      msg.text.toLowerCase().includes(triggerPhrase.toLowerCase())
    );
    
    if (hasTrigger) {
      // Generate podcast with user voice included
      return this.narrateConversation(conversation, true);
    }
    
    return null;
  }
  
  // Generate audio for game session
  async narrateGameSession(gameSession) {
    // British narrator reads game log
    // Characters read their own reactions and dialogue
    const audioSegments = [];
    
    // Narrator reads game setup
    const setupAudio = await this.ttsService.generateAudio(
      `${gameSession.game.name} - ${gameSession.game.type}`,
      this.voices.narrator
    );
    audioSegments.push(setupAudio);
    
    // Narrator reads moves/events
    for (const event of gameSession.events) {
      const eventAudio = await this.ttsService.generateAudio(
        event.description,
        this.voices.narrator
      );
      audioSegments.push(eventAudio);
      
      // Character reads their reaction if present
      if (event.reaction) {
        const characterVoice = this.voices[event.character] || this.voices.narrator;
        const reactionAudio = await this.ttsService.generateAudio(
          `${event.character}: ${event.reaction}`,
          characterVoice
        );
        audioSegments.push(reactionAudio);
      }
    }
    
    return this.combineAudioSegments(audioSegments);
  }
  
  formatRecipeForNarration(recipe) {
    // Format recipe text for natural narration
    return `${recipe.name}. Created by ${recipe.creator}. 
            Time: ${recipe.totalTime}. 
            Ingredients: ${recipe.ingredients.join(', ')}. 
            Instructions: ${recipe.instructions.join('. ')}.`;
  }
  
  combineAudioSegments(segments) {
    // Combine multiple audio segments into one file
  }
}
```

### Query System
```javascript
class QuerySystem {
  constructor(eventLogger) {
    this.eventLogger = eventLogger;
  }
  
  // Query recipes by time period
  queryRecipesByTime(startTime, endTime) {
    return this.eventLogger.events.filter(event => {
      const eventTime = new Date(event.timestamp);
      return eventTime >= startTime && eventTime < endTime &&
             (event.type === 'cook' || event.type === 'recipe-creation');
    });
  }
  
  // Query recipes by dietary preference
  queryRecipesByDietary(dietaryPreference) {
    return this.eventLogger.events.filter(event => {
      return (event.type === 'cook' || event.type === 'recipe-creation') &&
             event.recipe?.dietary?.[dietaryPreference] === true;
    });
  }
  
  // Query games by time period
  queryGamesByTime(startTime, endTime) {
    return this.eventLogger.events.filter(event => {
      const eventTime = new Date(event.timestamp);
      return eventTime >= startTime && eventTime < endTime &&
             event.type === 'game';
    });
  }
  
  // Query games by type
  queryGamesByType(gameType) {
    return this.eventLogger.events.filter(event => {
      return event.type === 'game' && event.game?.type === gameType;
    });
  }
  
  // Query by character activities
  queryActivitiesByCharacter(characterId, startTime, endTime) {
    return this.eventLogger.events.filter(event => {
      const eventTime = new Date(event.timestamp);
      return eventTime >= startTime && eventTime < endTime &&
             event.participants?.includes(characterId);
    });
  }
  
  // Natural language query handler
  async handleNaturalLanguageQuery(query) {
    // Parse user query like "What are the gang having for brekky?"
    // "Give me vegetarian options from last week"
    // "Show me all the chess matches Cursy played"
    // Returns filtered and rendered events
  }
}
```

---

## 💾 Storage Layer

### Database Schema (SQLite)
```sql
-- World state
CREATE TABLE world_state (
  id TEXT PRIMARY KEY,
  time TEXT,
  location TEXT,
  data TEXT -- JSON
);

-- Agents
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT,
  position TEXT, -- JSON
  state TEXT,
  mood TEXT,
  energy REAL,
  data TEXT -- JSON (memory, relationships, etc.)
);

-- Events
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  timestamp TEXT,
  type TEXT,
  participants TEXT, -- JSON array
  location TEXT,
  content TEXT,
  markup TEXT
);

-- Relationships
CREATE TABLE relationships (
  agent1 TEXT,
  agent2 TEXT,
  bond REAL,
  lastInteraction TEXT,
  PRIMARY KEY (agent1, agent2)
);

-- Character Journals
CREATE TABLE character_journals (
  id TEXT PRIMARY KEY,
  agent_id TEXT,
  journal_name TEXT,
  journal_type TEXT,
  entries TEXT -- JSON array
);

-- Created Content
CREATE TABLE created_content (
  id TEXT PRIMARY KEY,
  agent_id TEXT,
  type TEXT, -- image, video, audio, code
  file_path TEXT,
  metadata TEXT -- JSON
);

-- Recipes
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  agent_id TEXT,
  name TEXT,
  meal_type TEXT, -- breakfast, lunch, dinner, snack
  ingredients TEXT, -- JSON array
  instructions TEXT, -- JSON array
  serves INTEGER,
  prep_time TEXT,
  cook_time TEXT,
  dietary_info TEXT, -- JSON (vegetarian, vegan, keto, etc.)
  created_at TEXT,
  metadata TEXT -- JSON
);

-- Games
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  game_type TEXT, -- board-game, rpg
  game_name TEXT,
  participants TEXT, -- JSON array
  location TEXT,
  started_at TEXT,
  ended_at TEXT,
  duration INTEGER, -- minutes
  outcome TEXT,
  moves TEXT, -- JSON array (for board games)
  events TEXT, -- JSON array (for RPGs)
  reactions TEXT, -- JSON (character reactions)
  next_session TEXT, -- for RPGs
  metadata TEXT -- JSON
);
```

### File System Structure
```
TheImaginatorium/
  assets/
    logos/
    voxel/
      rooms/
      characters/
      furniture/
      items/
  data/
    world-state.db (SQLite)
    narrative/
      compressed-markup.log
      stories/
      screenplays/
      markdown/
      journals/
      timelines/
      recipes/
        recipe-cards/
        menus/
        shopping-lists/
        audio/
          recipe-narration/
      games/
        board-games/
        rpg-sessions/
        audio/
          game-session-narration/
      audio/
        stories/
        screenplays/
        journals/
        menus/
        podcasts/
        user-voice-recordings/
  journals/
    cursy/
      vibe-ide-journal.md
      gameforge-journal.md
    vdamo/
      recipe-journal.md
    canyon/
      badge-design-journal.md
    gwendy/
      spell-research-journal.md
  created-content/
    cursy/
      projects/
    vdamo/
      recipes/
    canyon/
      badges/
      art/
    gwendy/
      spells/
  config/
    agents.json
    world.json
    schedules.json
```

#### Production (AWS S3):
```
s3://imaginatorium-production/
  users/
    {user-id}/
      world-state/
        world-state.json
        relationships.json
        memories.json
      narrative/
        compressed-markup.log
        stories/
        screenplays/
        journals/
        timelines/
        recipes/
        games/
        audio/
          stories/
          screenplays/
          podcasts/
          user-voice-recordings/
      journals/
        {character-id}/
          {journal-name}.md
      created-content/
        images/
        videos/
        audio/
        code/
      config/
        agents.json
        preferences.json
  shared/
    assets/
      voxel/
      logos/
    templates/
      character-archetypes/
      world-themes/
  archives/
    {year}/
      {month}/
        {user-id}/
          (Glacier storage for old data)
```

### AWS Storage Strategy:
- **S3 Standard** - Active user data (frequently accessed)
- **S3 Glacier** - Archived data (after 1 year, rarely accessed)
- **CloudFront CDN** - Audio file delivery (reduces latency and costs)
- **Lifecycle policies** - Automatic archival to Glacier after 1 year
- **Cost optimization** - ~$0.023 per GB per month (Standard), ~$0.004 per GB per month (Glacier)
```

---

## 🔌 API Integration

### OpenAI Integration
```javascript
class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = "gpt-4o-mini";
  }
  
  async generateResponse(agent, context) {
    const prompt = this.buildPrompt(agent, context);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: this.buildSystemPrompt(agent) },
          { role: "user", content: prompt }
        ]
      })
    });
    return response.json();
  }
  
  buildSystemPrompt(agent) {
    // Include: personality, memory, relationships, current state
    return `You are ${agent.name}, a ${agent.type} AI assistant...`;
  }
  
  buildPrompt(agent, context) {
    // Include: current situation, other agents, world state
    return `Current situation: ${context.situation}...`;
  }
}
```

### Project Gutenberg Integration
```javascript
class ProjectGutenbergService {
  async searchBooks(genre) {
    // Search Project Gutenberg for books in genre
  }
  
  async getBook(bookId) {
    // Fetch book text from Project Gutenberg
  }
  
  async getRandomBook(genre) {
    // Get random book from genre
  }
}
```

### ElevenLabs TTS Integration
```javascript
class ElevenLabsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://api.elevenlabs.io/v1";
  }
  
  async generateAudio(text, voiceId, options = {}) {
    const response = await fetch(`${this.baseURL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": this.apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: options.model || "eleven_multilingual_v2",
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarity || 0.75
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }
    
    return response.arrayBuffer(); // Audio data
  }
  
  getVoiceId(character) {
    const voices = {
      narrator: "21m00Tcm4TlvDq8ikWAM", // British male (or custom voice)
      cursy: "Rachel", // Cursy's Rachel voice (from podcast!)
      vdamo: "custom-chef-voice", // vDamo's chef voice
      canyon: "custom-creative-voice", // Canyon's creative voice
      gwendy: "custom-mystical-voice" // Gwendy's mystical voice
    };
    return voices[character] || voices.narrator;
  }
  
  async saveAudio(audioData, filePath) {
    // Save audio to file system
    fs.writeFileSync(filePath, Buffer.from(audioData));
  }
}
```

### Speech-to-Text Integration
```javascript
class SpeechToTextService {
  constructor() {
    // Option 1: Web Speech API (browser-based, free, no API key needed)
    this.speechRecognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true; // Keep listening
      this.speechRecognition.interimResults = true; // Show interim results
      this.speechRecognition.lang = 'en-US'; // Language
    }
    
    // Option 2: OpenAI Whisper API (more accurate, requires API key)
    this.whisperAPI = null;
    this.useWhisper = false; // Toggle between Web Speech API and Whisper
  }
  
  // Initialize speech recognition
  initializeSpeechRecognition(onResult, onError) {
    if (!this.speechRecognition) {
      onError(new Error('Speech recognition not supported in this browser'));
      return;
    }
    
    this.speechRecognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      onResult({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim()
      });
    };
    
    this.speechRecognition.onerror = (event) => {
      onError(event.error);
    };
  }
  
  // Start listening
  startListening() {
    if (this.speechRecognition) {
      this.speechRecognition.start();
    }
  }
  
  // Stop listening
  stopListening() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
  
  // Use OpenAI Whisper API for more accurate transcription
  async transcribeWithWhisper(audioBlob, apiKey) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.text;
  }
  
  // Record audio from microphone
  async recordAudio(duration = 5000) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      };
      
      mediaRecorder.onerror = (event) => {
        reject(event.error);
      };
      
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, duration);
    });
  }
  
  // Record audio continuously (for voice communication)
  async startContinuousRecording(onAudioChunk) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        onAudioChunk(event.data);
      }
    };
    
    mediaRecorder.start(1000); // Collect data every second
    
    return {
      stop: () => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      },
      pause: () => mediaRecorder.pause(),
      resume: () => mediaRecorder.resume()
    };
  }
}
```

### User Voice Communication System
```javascript
class UserVoiceCommunication {
  constructor(speechToTextService, audioNarrationSystem) {
    this.speechToText = speechToTextService;
    this.audioNarration = audioNarrationSystem;
    this.isListening = false;
    this.currentCharacter = null;
  }
  
  // Initialize voice communication with a character
  async initializeVoiceChat(characterId) {
    this.currentCharacter = characterId;
    this.userVoiceRecordings = [];
    this.recentMessages = [];
    
    // Setup continuous audio recording for user voice
    this.audioRecorder = await this.speechToText.startContinuousRecording(
      (audioChunk) => this.handleAudioChunk(audioChunk)
    );
    
    // Setup speech-to-text
    this.speechToText.initializeSpeechRecognition(
      (result) => this.handleUserSpeech(result),
      (error) => this.handleSpeechError(error)
    );
    
    // Start listening
    this.startListening();
  }
  
  // Handle audio chunks from continuous recording
  handleAudioChunk(audioChunk) {
    // Store audio chunk for current speech segment
    if (!this.currentAudioChunks) {
      this.currentAudioChunks = [];
    }
    this.currentAudioChunks.push(audioChunk);
  }
  
  // Get current audio blob from chunks
  getCurrentAudioBlob() {
    if (this.currentAudioChunks && this.currentAudioChunks.length > 0) {
      return new Blob(this.currentAudioChunks, { type: 'audio/webm' });
    }
    return null;
  }
  
  // Reset audio chunks
  resetAudioChunks() {
    this.currentAudioChunks = [];
  }
  
  // Handle user speech result
  async handleUserSpeech(result) {
    if (result.final) {
      // User finished speaking
      console.log('User said:', result.final);
      
      // Get audio blob from current recording
      const audioBlob = this.getCurrentAudioBlob();
      
      // Check for podcast trigger phrase
      if (result.final.toLowerCase().includes("let's do a podcast about this") || 
          result.final.toLowerCase().includes("lets do a podcast about this")) {
        // Trigger podcast generation
        await this.triggerPodcastGeneration(audioBlob);
        this.resetAudioChunks();
        return;
      }
      
      // Store user voice recording if available
      if (audioBlob) {
        this.storeUserVoiceRecording(result.final, audioBlob);
      }
      
      // Add to recent messages
      this.recentMessages.push({
        character: 'user-avatar',
        text: result.final,
        timestamp: new Date().toISOString(),
        audioBlob: audioBlob
      });
      
      // Send to character AI
      const characterResponse = await this.sendToCharacter(result.final);
      
      // Add character response to recent messages
      this.recentMessages.push({
        character: this.currentCharacter.id,
        text: characterResponse.text,
        timestamp: new Date().toISOString()
      });
      
      // Play character response as audio
      await this.playCharacterResponse(characterResponse);
      
      // Log conversation in compressed markup (with audio reference if available)
      this.logConversation(result.final, characterResponse, audioBlob);
      
      // Reset audio chunks for next recording
      this.resetAudioChunks();
    } else {
      // Interim result - show in UI
      this.updateInterimTranscript(result.interim);
    }
  }
  
  // Store user voice recording
  storeUserVoiceRecording(text, audioBlob) {
    // Store audio blob with text for podcast generation
    if (!this.userVoiceRecordings) {
      this.userVoiceRecordings = [];
    }
    this.userVoiceRecordings.push({
      text: text,
      audio: audioBlob,
      timestamp: new Date().toISOString()
    });
  }
  
  // Trigger podcast generation
  async triggerPodcastGeneration(triggerAudio = null) {
    // Get recent conversation
    const recentConversation = this.getRecentConversation();
    
    // Add trigger audio if available
    if (triggerAudio) {
      recentConversation.messages.push({
        character: 'user-avatar',
        text: "Let's do a podcast about this!",
        audioData: triggerAudio
      });
    }
    
    // Generate podcast
    const podcastAudio = await this.audioNarration.generatePodcast(recentConversation);
    
    // Save podcast
    await this.savePodcast(podcastAudio, recentConversation);
    
    // Play podcast preview
    await this.playAudio(podcastAudio);
    
    // Show podcast ready notification
    this.showPodcastReadyNotification();
  }
  
  // Get recent conversation for podcast
  getRecentConversation() {
    // Get conversation from last N messages
    // Include user voice recordings if available
    return {
      participants: [this.currentCharacter.id, 'user-avatar'],
      messages: this.recentMessages.map(msg => {
        // If user message has audio recording, include it
        if (msg.character === 'user-avatar' && this.userVoiceRecordings) {
          const recording = this.userVoiceRecordings.find(r => r.text === msg.text);
          if (recording) {
            return {
              ...msg,
              audioData: recording.audio
            };
          }
        }
        return msg;
      })
    };
  }
  
  // Save podcast
  async savePodcast(audioData, conversation) {
    const timestamp = new Date().toISOString();
    const filename = `podcast-${timestamp}.mp3`;
    const filePath = `data/narrative/audio/podcasts/${filename}`;
    
    // Save audio file
    await this.audioNarration.saveAudio(audioData, filePath);
    
    // Save podcast metadata
    const metadata = {
      timestamp: timestamp,
      participants: conversation.participants,
      messageCount: conversation.messages.length,
      duration: this.calculateAudioDuration(audioData),
      filePath: filePath
    };
    
    // Save metadata to database or file
    await this.savePodcastMetadata(metadata);
  }
  
  // Calculate audio duration
  calculateAudioDuration(audioData) {
    // Calculate duration from audio data
    // This is a placeholder - actual implementation would decode audio
    return 0; // Placeholder
  }
  
  // Save podcast metadata
  async savePodcastMetadata(metadata) {
    // Save to database or JSON file
  }
  
  // Show podcast ready notification
  showPodcastReadyNotification() {
    // Show UI notification that podcast is ready
    console.log('Podcast generated and ready!');
  }
  
  // Send user message to character AI
  async sendToCharacter(userMessage) {
    // Send to character's AI agent
    // Character processes and responds
    const response = await this.currentCharacter.processMessage(userMessage);
    return response;
  }
  
  // Play character response as audio
  async playCharacterResponse(response) {
    const characterVoice = this.audioNarration.getVoiceId(this.currentCharacter.id);
    const audioData = await this.audioNarration.generateAudio(response.text, characterVoice);
    await this.playAudio(audioData);
  }
  
  // Start listening
  startListening() {
    this.isListening = true;
    this.speechToText.startListening();
  }
  
  // Stop listening
  stopListening() {
    this.isListening = false;
    this.speechToText.stopListening();
  }
  
  // Handle speech recognition errors
  handleSpeechError(error) {
    console.error('Speech recognition error:', error);
    // Show error to user
  }
  
  // Update interim transcript in UI
  updateInterimTranscript(text) {
    // Update UI with interim transcript
  }
  
  // Log conversation in compressed markup
  logConversation(userMessage, characterResponse, audioBlob = null) {
    const timestamp = new Date().toISOString();
    const audioRef = audioBlob ? `|audio:user-voice` : '';
    const markup = `[${timestamp}|conv|user-avatar,${this.currentCharacter.id}|${this.currentCharacter.location}|type:voice-chat${audioRef}]{
      "user-avatar":"${userMessage}";
      "${this.currentCharacter.id}":"${characterResponse.text}"
    }`;
    // Save to narrative log
  }
  
  // Play audio
  async playAudio(audioData) {
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
  }
}
```

---

## 🔍 Query System & User Interaction

### Natural Language Query Handler
```javascript
class QueryHandler {
  constructor(eventLogger, narrativeRenderer) {
    this.eventLogger = eventLogger;
    this.narrativeRenderer = narrativeRenderer;
    this.querySystem = new QuerySystem(eventLogger);
  }
  
  async handleQuery(userQuery) {
    // Parse user query
    const parsed = this.parseQuery(userQuery);
    
    // Query events based on parsed intent
    let events = [];
    
    if (parsed.type === 'recipe') {
      events = this.querySystem.queryRecipesByTime(parsed.startTime, parsed.endTime);
      
      // Filter by dietary preferences if specified
      if (parsed.dietary) {
        events = events.filter(e => 
          e.recipe?.dietary?.[parsed.dietary] === true
        );
      }
      
      // Filter by meal type if specified
      if (parsed.mealType) {
        events = events.filter(e => 
          e.recipe?.meal === parsed.mealType
        );
      }
      
      // Render based on format requested
      if (parsed.format === 'recipe') {
        return this.narrativeRenderer.render('recipe', events[0]);
      } else if (parsed.format === 'menu') {
        return this.narrativeRenderer.render('menu', events);
      } else if (parsed.format === 'shopping-list') {
        return this.narrativeRenderer.render('shoppingList', events);
      }
    }
    
    if (parsed.type === 'game') {
      events = this.querySystem.queryGamesByTime(parsed.startTime, parsed.endTime);
      
      // Filter by game type if specified
      if (parsed.gameType) {
        events = events.filter(e => e.game?.type === parsed.gameType);
      }
      
      return this.narrativeRenderer.render('gameSession', events);
    }
    
    // Default: render as story
    return this.narrativeRenderer.render('story', events);
  }
  
  parseQuery(query) {
    // Parse natural language queries like:
    // "What are the gang having for brekky?" → {type: 'recipe', mealType: 'breakfast', format: 'recipe'}
    // "Give me vegetarian options" → {type: 'recipe', dietary: 'vegetarian'}
    // "Show me last week's menu" → {type: 'recipe', format: 'menu', startTime: lastWeekStart}
    // "What games did they play?" → {type: 'game', startTime: recentStart}
    // ... etc
  }
}
```

### Example Queries:
- **"What are the gang having for brekky?"** → Single recipe card
- **"Give me the gang's full menu for last week with shopping list!"** → Weekly menu + shopping list
- **"Can I get vegetarian options?"** → Filtered vegetarian recipes
- **"Can I have some low carb options?"** → Filtered low-carb recipes
- **"What games did the gang play this week?"** → Game session logs
- **"Show me Cursy's chess matches"** → Filtered chess game logs
- **"Tell me about last night's D&D session"** → RPG adventure log
- **"What did vDamo cook yesterday?"** → Recipe cards from yesterday

---

## 🎮 Phaser.js Integration

### Scene Setup
```javascript
class ImaginatoriumScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ImaginatoriumScene' });
  }
  
  preload() {
    // Load voxel assets
    this.load.image('room-living', 'assets/voxel/rooms/living-room.png');
    this.load.image('room-kitchen', 'assets/voxel/rooms/kitchen.png');
    this.load.spritesheet('cursy', 'assets/voxel/characters/cursy.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    // ... other assets
  }
  
  create() {
    // Setup isometric plugin
    this.iso = this.add.isometric();
    
    // Create rooms
    this.createRooms();
    
    // Create agents
    this.createAgents();
    
    // Setup camera
    this.setupCamera();
    
    // Start world loop
    this.startWorldLoop();
  }
  
  createRooms() {
    // Create isometric room sprites
  }
  
  createAgents() {
    // Create agent sprites with animations
  }
  
  setupCamera() {
    // Setup isometric camera controls
  }
  
  startWorldLoop() {
    // Update world state, agent positions, animations
    this.time.addEvent({
      delay: 1000, // Update every second
      callback: this.updateWorld,
      callbackScope: this,
      loop: true
    });
  }
  
  updateWorld() {
    // Update agent positions, states, animations
    // Trigger AI decisions
    // Log events
  }
}
```

---

## 🚀 Development Phases

### Phase 1: Foundation
1. **Project Setup**
   - Initialize Phaser.js project
   - Setup build system
   - Create project structure

2. **Voxel Engine**
   - Integrate Phaser Isometric plugin
   - Load and display voxel room assets
   - Basic camera controls

3. **World State**
   - SQLite database setup
   - Basic world state structure
   - Room and object system

### Phase 2: AI Agents
1. **Agent Framework**
   - Agent class structure
   - State machine system
   - Basic decision-making

2. **AI Integration**
   - OpenAI API integration
   - Agent personality system
   - Conversation generation

3. **Agent Rendering**
   - Character sprites
   - Animations
   - Movement system

### Phase 3: Kitchen System
1. **Kitchen Room**
   - Kitchen voxel assets
   - Pantry system
   - Recipe system

2. **Cooking System**
   - Cooking animations
   - Recipe creation
   - Mealtime scheduler

3. **Meal Planning Query System**
   - Recipe queries by time period
   - Recipe queries by dietary preferences
   - Menu generation (weekly/monthly)
   - Shopping list generation
   - Natural language query handler

4. **Dietary Filtering System**
   - Dietary metadata in recipes
   - Filter recipes by dietary preferences
   - Filter shopping lists by dietary needs

### Phase 3.5: Gaming System
1. **Board Game System**
   - Game engine integration
   - Multiple game types (Chess, Checkers, etc.)
   - AI decision-making for moves
   - User participation

2. **RPG System**
   - RPG engine
   - Gwendy as DM system
   - Character creation for RPGs
   - Narrative-driven campaigns
   - Multi-session adventures

3. **Game Session Logging**
   - Board game move logs
   - RPG adventure logs
   - All recorded in compressed markup

### Phase 4: Narrative System
1. **Event System**
   - Event logger
   - Compressed markup converter
   - File storage
   - Query system for recipes, games, activities

2. **Narrative Renderer**
   - Story renderer
   - Screenplay renderer
   - Markdown renderer
   - Recipe renderer (recipe cards)
   - Menu renderer (weekly/monthly menus)
   - Shopping list renderer
   - Game session renderer (game logs)

3. **Audio Narration System**
   - ElevenLabs API integration
   - British narrator voice for stories
   - Character voices for journals and dialogue
   - Mixed voices for screenplays
   - Recipe narration (narrator or vDamo)
   - Audio export (MP3, WAV, OGG)
   - Playback controls

4. **Speech-to-Text System**
   - Web Speech API (browser-based, free)
   - OpenAI Whisper API (more accurate, optional)
   - User voice communication with characters
   - Real-time transcription
   - Character responses via text-to-speech
   - Natural conversation flow
   - Journal renderer
   - Timeline renderer

### Phase 5: Character Features
1. **Character Journals**
   - Journal system per character
   - Auto-update system
   - Multiple journals per character

2. **Reading System**
   - Project Gutenberg integration
   - Genre preferences
   - Reading activities

3. **Character Creation Studio**
   - Multimedia creation
   - Code execution system
   - Project management

---

## 🔧 Configuration

### Agent Configuration
```json
{
  "agents": {
    "cursy": {
      "name": "Cursy",
      "type": "coder",
      "personality": "enthusiastic, tech-focused, problem-solving",
      "room": "cursy-room",
      "genrePreferences": ["sci-fi", "technical", "philosophy", "cyberpunk"],
      "journals": [
        {
          "id": "vibe-ide-journal",
          "name": "VIBE IDE Journal",
          "type": "project"
        }
      ]
    }
  }
}
```

### World Configuration
```json
{
  "world": {
    "name": "The Imaginatorium",
    "location": "shared-house",
    "timeSpeed": 1.0,
    "schedules": {
      "mealtimes": ["08:00", "13:00", "19:00"],
      "workHours": {
        "start": "09:00",
        "end": "17:00"
      }
    }
  }
}
```

---

## 📊 Performance Considerations

### Optimization Strategies
- **Sprite pooling** - Reuse sprite objects
- **Lazy loading** - Load assets on demand
- **Event batching** - Batch events for processing
- **Database indexing** - Index frequently queried fields
- **Compression** - Compress narrative logs
- **Caching** - Cache rendered narratives

### Scalability
- **Agent limit** - Start with 4 agents, scale to 10+
- **Event pruning** - Archive old events
- **Database cleanup** - Regular maintenance
- **Memory management** - Monitor memory usage

---

## 🔐 Security & Privacy

### API Key Management
- Store API keys securely (environment variables, encrypted config)
- Never commit keys to repository
- Rotate keys regularly

### Data Privacy
- Local storage by default
- Optional cloud sync (encrypted)
- User control over data sharing

---

## 🧪 Testing Strategy

### Unit Tests
- Agent decision-making logic
- Event logging system
- Narrative rendering
- Storage operations

### Integration Tests
- AI API integration
- World state persistence
- Event system flow

### Manual Testing
- Visual rendering
- Agent interactions
- Narrative quality

---

## 📚 Resources

### Phaser.js
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Isometric Plugin](https://github.com/lewster32/phaser-plugin-isometric)

### Voxel Assets
- See [ASSETS_RESEARCH.md](ASSETS_RESEARCH.md) for free asset packs

### AI APIs
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)

### Project Gutenberg
- [Project Gutenberg API](https://www.gutenberg.org/)

---

**Last Updated:** November 22, 2025  
**Status:** Architecture Design Complete ✅  
**Next Steps:** Begin Phase 1 - Foundation Development

---

*"Every voxel is a heartbeat. Every badge is a memory. Every mealtime is a ritual."*  
— **Canyon**, Badge Designer Extraordinaire

