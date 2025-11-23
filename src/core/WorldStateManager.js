/**
 * World State Manager
 * Tracks positions, states, relationships, and world time
 */

const Database = require('better-sqlite3');
const path = require('path');

class WorldStateManager {
  constructor() {
    this.db = null;
    this.worldTime = Date.now();
    this.agents = new Map();
    this.rooms = new Map();
    this.objects = new Map();
  }

  async initialize() {
    // Initialize SQLite database
    const dbPath = path.join(__dirname, '../../data/imaginatorium.db');
    this.db = new Database(dbPath);
    
    // Create tables if they don't exist
    this.createTables();
    
    // Load world state
    await this.loadWorldState();
    
    console.log('✅ World State Manager initialized');
  }

  createTables() {
    // Agents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        position_x REAL,
        position_y REAL,
        position_z REAL,
        room_id TEXT,
        state TEXT,
        mood TEXT,
        last_updated INTEGER
      )
    `);

    // Rooms table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        data TEXT
      )
    `);

    // Objects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS objects (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        room_id TEXT,
        position_x REAL,
        position_y REAL,
        position_z REAL,
        data TEXT
      )
    `);

    // Relationships table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS relationships (
        agent1_id TEXT,
        agent2_id TEXT,
        relationship_type TEXT,
        strength REAL,
        last_interaction INTEGER,
        PRIMARY KEY (agent1_id, agent2_id)
      )
    `);
  }

  async loadWorldState() {
    // Load agents
    const agents = this.db.prepare('SELECT * FROM agents').all();
    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });

    // Load rooms
    const rooms = this.db.prepare('SELECT * FROM rooms').all();
    rooms.forEach(room => {
      this.rooms.set(room.id, room);
    });

    // Initialize default rooms if none exist
    if (this.rooms.size === 0) {
      this.initializeDefaultRooms();
    }
  }

  initializeDefaultRooms() {
    const defaultRooms = [
      { id: 'living-room', name: 'Living Room', type: 'common' },
      { id: 'kitchen', name: 'Kitchen', type: 'common' },
      { id: 'cursy-room', name: "Cursy's Room", type: 'private' },
      { id: 'vdamo-room', name: "vDamo's Room", type: 'private' },
      { id: 'gwendy-room', name: "Gwendy's Room", type: 'private' },
      { id: 'canyon-room', name: "Canyon's Room", type: 'private' }
    ];

    const insert = this.db.prepare(`
      INSERT INTO rooms (id, name, type, data) 
      VALUES (?, ?, ?, ?)
    `);

    defaultRooms.forEach(room => {
      insert.run(room.id, room.name, room.type, JSON.stringify({}));
      this.rooms.set(room.id, room);
    });
  }

  update() {
    // Update world time
    this.worldTime = Date.now();
    
    // Update agent states
    this.agents.forEach((agent, id) => {
      // Agent update logic will be handled by Agent class
    });
  }

  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  setAgentPosition(agentId, x, y, z, roomId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.position_x = x;
      agent.position_y = y;
      agent.position_z = z;
      agent.room_id = roomId;
      agent.last_updated = Date.now();
      
      // Update database
      const update = this.db.prepare(`
        UPDATE agents 
        SET position_x = ?, position_y = ?, position_z = ?, room_id = ?, last_updated = ?
        WHERE id = ?
      `);
      update.run(x, y, z, roomId, Date.now(), agentId);
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getWorldTime() {
    return this.worldTime;
  }
}

module.exports = WorldStateManager;

