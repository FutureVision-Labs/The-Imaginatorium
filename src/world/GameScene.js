/**
 * The Imaginatorium - Phaser Game Scene
 * Main scene for rendering the voxel world
 * 
 * Created by Team DC
 */

const Phaser = require('phaser');

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.characters = new Map();
    this.rooms = new Map();
  }

  preload() {
    console.log('📦 Loading assets...');
    
    // TODO: Load voxel assets
    // For now, we'll create placeholder assets
    this.load.image('placeholder-room', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    this.load.image('placeholder-character', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    
    console.log('✅ Assets loaded!');
  }

  create() {
    console.log('🎨 Creating game scene...');
    
    // Set background color (dark blue)
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Create placeholder room
    this.createRoom('living-room', 400, 300);
    
    // Add text to show the world is running
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
  }

  createRoom(roomId, x, y) {
    // Create a placeholder room sprite
    const room = this.add.rectangle(x, y, 600, 400, 0x2d2d44);
    room.setStrokeStyle(2, 0x00a2ff);
    
    // Add room label
    const label = this.add.text(x, y - 180, roomId.replace('-', ' ').toUpperCase(), {
      fontSize: '14px',
      fill: '#00a2ff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.rooms.set(roomId, { sprite: room, label: label });
    
    return room;
  }

  addCharacter(characterId, x, y) {
    // Create a placeholder character sprite
    const character = this.add.circle(x, y, 20, 0x00d4ff);
    character.setStrokeStyle(2, 0x00a2ff);
    
    // Add character label
    const label = this.add.text(x, y - 30, characterId, {
      fontSize: '12px',
      fill: '#e6f7ff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.characters.set(characterId, { sprite: character, label: label });
    
    return character;
  }

  update() {
    // Update game loop
    // This will be called every frame (60 FPS)
  }
}

module.exports = GameScene;

