/**
 * The Imaginatorium - Phaser Game Manager
 * Manages the Phaser game instance and scenes
 * 
 * Created by Team DC
 */

const Phaser = require('phaser');
const GameScene = require('./GameScene');

class GameManager {
  constructor(config = {}) {
    this.config = {
      type: Phaser.AUTO,
      width: config.width || 1200,
      height: config.height || 800,
      parent: config.parent || 'imaginatorium-game',
      backgroundColor: '#1a1a2e',
      scene: [GameScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: config.debug || false
        }
      },
      ...config
    };
    
    this.game = null;
    this.scene = null;
  }

  initialize() {
    console.log('🎮 Initializing Phaser game...');
    
    // Create Phaser game instance
    this.game = new Phaser.Game(this.config);
    
    // Get the game scene
    this.scene = this.game.scene.getScene('GameScene');
    
    console.log('✅ Phaser game initialized!');
    return Promise.resolve();
  }

  addCharacter(characterId, x, y) {
    if (this.scene) {
      return this.scene.addCharacter(characterId, x, y);
    }
    return null;
  }

  createRoom(roomId, x, y) {
    if (this.scene) {
      return this.scene.createRoom(roomId, x, y);
    }
    return null;
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.scene = null;
    }
  }
}

module.exports = GameManager;

