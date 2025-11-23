/**
 * Base Agent Class
 * All AI characters inherit from this
 */

class Agent {
  constructor(id, name, type, worldState, eventSystem) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.worldState = worldState;
    this.eventSystem = eventSystem;
    
    // State
    this.state = 'idle'; // idle, working, cooking, chatting, sleeping, dreaming
    this.mood = 'neutral';
    this.position = { x: 0, y: 0, z: 0 };
    this.roomId = 'living-room';
    
    // Memory
    this.memory = [];
    this.relationships = new Map();
    
    // Activity tracking
    this.currentActivity = null;
    this.activityStartTime = null;
    
    // Dream system
    this.dreamState = null;
    this.lastDreamTime = null;
    this.dreamCooldown = 8 * 60 * 60 * 1000; // 8 hours
  }

  update() {
    // Update agent state
    this.processState();
    
    // Check for state transitions
    this.checkStateTransitions();
    
    // Update position in world state
    this.worldState.setAgentPosition(
      this.id,
      this.position.x,
      this.position.y,
      this.position.z,
      this.roomId
    );
  }

  processState() {
    switch (this.state) {
      case 'idle':
        this.processIdle();
        break;
      case 'working':
        this.processWorking();
        break;
      case 'cooking':
        this.processCooking();
        break;
      case 'chatting':
        this.processChatting();
        break;
      case 'sleeping':
        this.processSleeping();
        break;
      case 'dreaming':
        this.processDreaming();
        break;
    }
  }

  processIdle() {
    // Idle behavior - decide what to do next
    // This will be overridden by specific agent types
  }

  processWorking() {
    // Working behavior
  }

  processCooking() {
    // Cooking behavior
  }

  processChatting() {
    // Chatting behavior
  }

  processSleeping() {
    // Sleeping behavior - transition to dreaming after some time
    const sleepDuration = Date.now() - this.activityStartTime;
    if (sleepDuration > 4 * 60 * 60 * 1000) { // 4 hours of sleep
      this.enterDreamState();
    }
  }

  processDreaming() {
    // Dreaming behavior - synthesize experiences into dreams
    const dreamDuration = Date.now() - this.activityStartTime;
    if (dreamDuration > 2 * 60 * 60 * 1000) { // 2 hours of dreaming
      this.exitDreamState();
    }
  }

  checkStateTransitions() {
    // Check if agent should transition to a new state
    // This will be overridden by specific agent types
  }

  enterState(newState) {
    const oldState = this.state;
    this.state = newState;
    this.activityStartTime = Date.now();
    
    // Log state change
    this.eventSystem.logEvent({
      type: 'mood',
      participants: [this.id],
      location: this.roomId,
      content: {
        stateChange: {
          from: oldState,
          to: newState
        }
      }
    });
  }

  enterDreamState() {
    this.enterState('dreaming');
    this.generateDream();
  }

  exitDreamState() {
    this.enterState('idle');
    this.lastDreamTime = Date.now();
  }

  generateDream() {
    // Synthesize recent experiences into a dream
    const recentEvents = this.eventSystem.queryEvents({
      participant: this.id,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    });

    // Create dream content from recent experiences
    const dreamContent = this.synthesizeDreamContent(recentEvents);
    
    // Log dream event
    this.eventSystem.logEvent({
      type: 'dream',
      participants: [this.id],
      location: this.roomId,
      content: {
        dream: dreamContent
      }
    });
  }

  synthesizeDreamContent(events) {
    // Combine events into dream narrative
    // This will be enhanced with AI synthesis later
    return {
      narrative: `Dreamed about ${events.length} recent experiences...`,
      integrated: events.map(e => e.type).join(', '),
      influence: 'next-day-activities'
    };
  }

  moveTo(roomId, x, y, z) {
    this.roomId = roomId;
    this.position = { x, y, z };
    
    // Log movement
    this.eventSystem.logEvent({
      type: 'move',
      participants: [this.id],
      location: roomId,
      content: {
        from: this.roomId,
        to: roomId,
        position: { x, y, z }
      }
    });
  }

  startConversation(otherAgent, topic) {
    // Start a conversation with another agent
    this.enterState('chatting');
    // Conversation logic will be implemented with AI
  }

  startWork(project) {
    // Start working on a project
    this.enterState('working');
    this.currentActivity = project;
  }

  startCooking(recipe) {
    // Start cooking
    this.enterState('cooking');
    this.currentActivity = recipe;
  }
}

module.exports = Agent;

