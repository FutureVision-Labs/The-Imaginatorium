/**
 * The Imaginatorium - Browser Entry Point
 * For running in a browser with Phaser rendering
 * 
 * Created by Team DC
 */

// Note: This will need to be bundled or use a module loader
// For now, we'll use a simple approach with global Phaser

// Wait for Phaser to load, then initialize
let imaginatorium = null;

function initImaginatorium() {
  if (typeof Phaser === 'undefined') {
    console.error('Phaser not loaded!');
    return;
  }
  
  // For now, we'll create a simple Phaser game directly
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'imaginatorium-game',
    backgroundColor: '#1a1a2e',
    scene: {
      preload: function() {
        console.log('📦 Loading assets...');
      },
      create: function() {
        console.log('🎨 Creating game scene...');
        this.add.text(400, 100, 'The Imaginatorium', {
          fontSize: '32px',
          fill: '#00a2ff',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(400, 150, 'Voxel World Loading...', {
          fontSize: '16px',
          fill: '#e6f7ff',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        console.log('✅ Game scene created!');
      },
      update: function() {
        // Game loop
      }
    }
  };
  
  const game = new Phaser.Game(config);
  imaginatorium = { game: game, isRunning: true };
}

// UI Controls
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

startBtn.addEventListener('click', () => {
  try {
    statusEl.textContent = 'Initializing...';
    startBtn.disabled = true;
    
    initImaginatorium();
    
    statusEl.textContent = 'Running! 🌟';
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (error) {
    console.error('Failed to start:', error);
    statusEl.textContent = 'Error: ' + error.message;
    startBtn.disabled = false;
  }
});

stopBtn.addEventListener('click', () => {
  if (imaginatorium && imaginatorium.game) {
    imaginatorium.game.destroy(true);
    imaginatorium = null;
  }
  statusEl.textContent = 'Stopped';
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Auto-start on load
window.addEventListener('load', () => {
  statusEl.textContent = 'Ready to start!';
});

