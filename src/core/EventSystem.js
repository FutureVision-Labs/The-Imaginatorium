/**
 * Event System
 * Captures and processes all events in The Imaginatorium
 */

const CMLParser = require('../narrative/CMLParser');

class EventSystem {
  constructor() {
    this.eventQueue = [];
    this.cmlParser = new CMLParser();
    this.eventHistory = [];
  }

  async initialize() {
    console.log('✅ Event System initialized');
  }

  logEvent(event) {
    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString();
    }

    // Add to queue
    this.eventQueue.push(event);

    // Add to history
    this.eventHistory.push(event);

    // Convert to CML and store
    const cml = this.cmlParser.eventToCML(event);
    // TODO: Store CML in database or file system
  }

  processQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      this.processEvent(event);
    }
  }

  processEvent(event) {
    // Process different event types
    switch (event.type) {
      case 'conversation':
        this.processConversation(event);
        break;
      case 'action':
        this.processAction(event);
        break;
      case 'discovery':
        this.processDiscovery(event);
        break;
      case 'work':
        this.processWork(event);
        break;
      case 'meal':
        this.processMeal(event);
        break;
      case 'cook':
        this.processCook(event);
        break;
      case 'game':
        this.processGame(event);
        break;
      case 'mood':
        this.processMood(event);
        break;
      case 'read':
        this.processRead(event);
        break;
      case 'jour':
        this.processJournal(event);
        break;
      case 'move':
        this.processMove(event);
        break;
      case 'dream':
        this.processDream(event);
        break;
      default:
        console.log(`Unknown event type: ${event.type}`);
    }
  }

  processConversation(event) {
    // Handle conversation events
  }

  processAction(event) {
    // Handle action events
  }

  processDiscovery(event) {
    // Handle discovery events
  }

  processWork(event) {
    // Handle work/creative activity events
  }

  processMeal(event) {
    // Handle mealtime events
  }

  processCook(event) {
    // Handle cooking/recipe creation events
  }

  processGame(event) {
    // Handle game events
  }

  processMood(event) {
    // Handle mood/emotional state events
  }

  processRead(event) {
    // Handle reading activity events
  }

  processJournal(event) {
    // Handle journal entry events
  }

  processMove(event) {
    // Handle location change events
  }

  processDream(event) {
    // Handle dream events
  }

  queryEvents(filters) {
    // Query events by time, participant, type, location, etc.
    return this.eventHistory.filter(event => {
      if (filters.type && event.type !== filters.type) return false;
      if (filters.participant && !event.participants?.includes(filters.participant)) return false;
      if (filters.location && event.location !== filters.location) return false;
      if (filters.startTime && new Date(event.timestamp) < filters.startTime) return false;
      if (filters.endTime && new Date(event.timestamp) > filters.endTime) return false;
      return true;
    });
  }
}

module.exports = EventSystem;

