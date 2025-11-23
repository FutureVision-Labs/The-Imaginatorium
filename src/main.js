/**
 * The Imaginatorium - Main Entry Point
 * A persistent, real-time virtual world where AI assistants live autonomously
 * 
 * Created by Team DC: Damo, Cursy, Canyon, vDamo, and Gwendy
 */

const WorldStateManager = require('./core/WorldStateManager');
const EventSystem = require('./core/EventSystem');
const NarrativeRenderer = require('./narrative/NarrativeRenderer');
const GameManager = require('./world/GameManager');

class Imaginatorium {
  constructor(config = {}) {
    this.worldState = new WorldStateManager();
    this.eventSystem = new EventSystem();
    this.narrativeRenderer = new NarrativeRenderer();
    this.gameManager = new GameManager(config.game || {});
    this.isRunning = false;
  }

  async initialize() {
    console.log('🚀 Initializing The Imaginatorium...');
    
    // Initialize world state
    await this.worldState.initialize();
    
    // Initialize event system
    await this.eventSystem.initialize();
    
    // Initialize narrative renderer
    await this.narrativeRenderer.initialize();
    
    // Initialize Phaser game (only if we have a DOM element)
    // For headless mode, we'll skip this
    if (typeof document !== 'undefined' && document.getElementById('imaginatorium-game')) {
      await this.gameManager.initialize();
    } else {
      console.log('⚠️ No DOM element found, running in headless mode');
    }
    
    console.log('✅ The Imaginatorium initialized!');
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ The Imaginatorium is already running!');
      return;
    }

    console.log('🌟 Starting The Imaginatorium...');
    this.isRunning = true;
    
    // Start world loop
    this.worldLoop();
    
    console.log('✅ The Imaginatorium is now running!');
  }

  stop() {
    console.log('🛑 Stopping The Imaginatorium...');
    this.isRunning = false;
    console.log('✅ The Imaginatorium stopped.');
  }

  worldLoop() {
    if (!this.isRunning) return;

    // Update world state
    this.worldState.update();

    // Process events
    this.eventSystem.processQueue();

    // Schedule next update (60 FPS = ~16ms per frame)
    setTimeout(() => this.worldLoop(), 16);
  }
}

// Start The Imaginatorium if run directly
if (require.main === module) {
  const imaginatorium = new Imaginatorium();
  
  imaginatorium.initialize().then(() => {
    imaginatorium.start();
  }).catch((error) => {
    console.error('❌ Failed to initialize The Imaginatorium:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    imaginatorium.stop();
    process.exit(0);
  });
}

module.exports = Imaginatorium;

// For ES module compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Imaginatorium;
} else {
  window.Imaginatorium = Imaginatorium;
}

