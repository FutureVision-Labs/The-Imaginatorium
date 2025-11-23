/**
 * Compressed Markup Language (CML) Parser
 * Converts events to CML and CML back to events
 */

class CMLParser {
  constructor() {
    // Event type abbreviations
    this.eventTypes = {
      'conversation': 'conv',
      'action': 'act',
      'discovery': 'disc',
      'work': 'work',
      'meal': 'meal',
      'cook': 'cook',
      'game': 'game',
      'mood': 'mood',
      'read': 'read',
      'jour': 'jour',
      'move': 'move',
      'dream': 'dream'
    };
  }

  eventToCML(event) {
    const timestamp = event.timestamp || new Date().toISOString();
    const type = this.eventTypes[event.type] || event.type;
    const participants = event.participants?.join(',') || '';
    const location = event.location || '';
    const metadata = this.formatMetadata(event.metadata || {});
    const content = this.formatContent(event);

    return `[${timestamp}|${type}|${participants}|${location}|${metadata}]{${content}}`;
  }

  formatMetadata(metadata) {
    return Object.entries(metadata)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');
  }

  formatContent(event) {
    switch (event.type) {
      case 'conversation':
        return this.formatConversation(event);
      case 'cook':
        return this.formatCook(event);
      case 'game':
        return this.formatGame(event);
      default:
        return JSON.stringify(event.content || {});
    }
  }

  formatConversation(event) {
    if (event.content?.dialogue) {
      return Object.entries(event.content.dialogue)
        .map(([character, text]) => `${character}:"${text}"`)
        .join(';');
    }
    return '';
  }

  formatCook(event) {
    if (event.content?.recipe) {
      const recipe = event.content.recipe;
      return `name:"${recipe.name}";ingredients:"${recipe.ingredients?.join(',') || ''}";steps:"${recipe.steps?.join(',') || ''}";dietary:"${recipe.dietary?.join(',') || ''}"`;
    }
    return '';
  }

  formatGame(event) {
    if (event.content?.game) {
      const game = event.content.game;
      return `type:${game.type};moves:"${game.moves || ''}";result:"${game.result || ''}"`;
    }
    return '';
  }

  cmlToEvent(cml) {
    // Parse CML string back to event object
    const match = cml.match(/\[([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\]]+)\]\{([^\}]+)\}/);
    if (!match) return null;

    const [, timestamp, type, participants, location, metadata, content] = match;

    // Reverse lookup event type
    const fullType = Object.entries(this.eventTypes).find(([_, abbrev]) => abbrev === type)?.[0] || type;

    return {
      timestamp,
      type: fullType,
      participants: participants ? participants.split(',') : [],
      location,
      metadata: this.parseMetadata(metadata),
      content: this.parseContent(fullType, content)
    };
  }

  parseMetadata(metadataStr) {
    const metadata = {};
    metadataStr.split(',').forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value) metadata[key] = value;
    });
    return metadata;
  }

  parseContent(type, contentStr) {
    switch (type) {
      case 'conversation':
        return this.parseConversation(contentStr);
      case 'cook':
        return this.parseCook(contentStr);
      case 'game':
        return this.parseGame(contentStr);
      default:
        try {
          return JSON.parse(contentStr);
        } catch {
          return { raw: contentStr };
        }
    }
  }

  parseConversation(contentStr) {
    const dialogue = {};
    contentStr.split(';').forEach(line => {
      const match = line.match(/(\w+):"([^"]+)"/);
      if (match) {
        dialogue[match[1]] = match[2];
      }
    });
    return { dialogue };
  }

  parseCook(contentStr) {
    const recipe = {};
    contentStr.split(';').forEach(pair => {
      const match = pair.match(/(\w+):"([^"]+)"/);
      if (match) {
        const [, key, value] = match;
        if (key === 'ingredients' || key === 'steps' || key === 'dietary') {
          recipe[key] = value.split(',');
        } else {
          recipe[key] = value;
        }
      }
    });
    return { recipe };
  }

  parseGame(contentStr) {
    const game = {};
    contentStr.split(';').forEach(pair => {
      const match = pair.match(/(\w+):"?([^"]+)"?/);
      if (match) {
        game[match[1]] = match[2];
      }
    });
    return { game };
  }
}

module.exports = CMLParser;

