/**
 * Narrative Renderer
 * Converts CML events into multiple narrative formats
 */

class NarrativeRenderer {
  constructor() {
    this.renderers = {
      story: this.renderStory.bind(this),
      screenplay: this.renderScreenplay.bind(this),
      journal: this.renderJournal.bind(this),
      timeline: this.renderTimeline.bind(this),
      recipe: this.renderRecipe.bind(this),
      menu: this.renderMenu.bind(this),
      shoppingList: this.renderShoppingList.bind(this),
      gameSession: this.renderGameSession.bind(this)
    };
  }

  async initialize() {
    console.log('✅ Narrative Renderer initialized');
  }

  render(format, events) {
    if (!Array.isArray(events)) {
      events = [events];
    }

    const renderer = this.renderers[format];
    if (!renderer) {
      throw new Error(`Unknown render format: ${format}`);
    }

    return renderer(events);
  }

  renderStory(events) {
    return events.map(event => {
      switch (event.type) {
        case 'conversation':
          return this.renderConversationStory(event);
        case 'cook':
          return this.renderCookStory(event);
        default:
          return `${event.timestamp}: ${event.type} event`;
      }
    }).join('\n\n');
  }

  renderConversationStory(event) {
    const dialogue = event.content?.dialogue || {};
    const lines = Object.entries(dialogue).map(([character, text]) => {
      return `${character} said, "${text}"`;
    });
    return lines.join(' ');
  }

  renderCookStory(event) {
    const recipe = event.content?.recipe;
    if (!recipe) return '';
    return `${event.participants[0]} created a new recipe: ${recipe.name}`;
  }

  renderScreenplay(events) {
    return events.map(event => {
      switch (event.type) {
        case 'conversation':
          return this.renderConversationScreenplay(event);
        default:
          return `[${event.type} event]`;
      }
    }).join('\n\n');
  }

  renderConversationScreenplay(event) {
    const dialogue = event.content?.dialogue || {};
    const lines = Object.entries(dialogue).map(([character, text]) => {
      return `${character.toUpperCase()}\n${text}`;
    });
    return lines.join('\n\n');
  }

  renderJournal(events) {
    return events.map(event => {
      return `**${event.timestamp}**\n${JSON.stringify(event, null, 2)}`;
    }).join('\n\n---\n\n');
  }

  renderTimeline(events) {
    return events.map(event => {
      return `${event.timestamp} - ${event.type}: ${event.location || 'unknown location'}`;
    }).join('\n');
  }

  renderRecipe(events) {
    const event = events[0];
    const recipe = event.content?.recipe;
    if (!recipe) return 'No recipe found';

    return `**${recipe.name}**\n\n**Ingredients:**\n${recipe.ingredients?.map(i => `- ${i}`).join('\n') || 'None'}\n\n**Instructions:**\n${recipe.steps?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'None'}\n\n**Dietary:** ${recipe.dietary?.join(', ') || 'None'}`;
  }

  renderMenu(events) {
    // Group by day and render as menu
    return events.map(event => {
      const recipe = event.content?.recipe;
      return `**${event.timestamp}** - ${recipe?.name || 'Meal'}`;
    }).join('\n');
  }

  renderShoppingList(events) {
    const ingredients = new Set();
    events.forEach(event => {
      const recipe = event.content?.recipe;
      recipe?.ingredients?.forEach(ing => ingredients.add(ing));
    });
    return Array.from(ingredients).map(ing => `- ${ing}`).join('\n');
  }

  renderGameSession(events) {
    return events.map(event => {
      const game = event.content?.game;
      return `**${event.timestamp}** - ${game?.type || 'Game'}: ${game?.result || 'In progress'}`;
    }).join('\n');
  }
}

module.exports = NarrativeRenderer;

