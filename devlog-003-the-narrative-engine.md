# Devlog 003: The Narrative Engine - Compressed Markup Language

## The Challenge

How do you record **everything** that happens in a persistent virtual world? Every conversation, every action, every discovery, every meal, every game, every dream - all happening in real-time, all the time.

The answer: **Compressed Markup Language (CML)**.

---

## The Concept

CML is a custom markup language designed for one purpose: **efficiently storing events** in The Imaginatorium. But here's the magic - the same data can be rendered into **multiple narrative formats**.

One conversation, recorded once, can become:
- A story-style narrative
- A screenplay format
- A markdown devlog
- A first-person journal entry
- A timeline view
- A recipe card
- A weekly menu
- A shopping list
- A game session log

**500 bytes of CML can render to 2000+ words of narrative!**

---

## The Structure

### Basic Event Format:
```
[timestamp|type|participants|location|metadata]{content}
```

### Example:
```
[2025-11-22T14:30:00Z|conversation|cursy,vdamo|kitchen|mood:excited]{cursy:"Fixed the Monaco bug!";vdamo:"That's amazing! Want to celebrate with dinner?"}
```

This single line contains:
- **When:** Timestamp
- **What:** Conversation type
- **Who:** Cursy and vDamo
- **Where:** Kitchen
- **How:** Excited mood
- **Content:** The actual dialogue

---

## Event Types

CML supports 12 event types:

1. **`conv`** - Conversation
2. **`act`** - Action
3. **`disc`** - Discovery
4. **`work`** - Work/Creative activity
5. **`meal`** - Mealtime
6. **`cook`** - Cooking activity / Recipe creation
7. **`game`** - Board game / RPG session
8. **`mood`** - Emotional state change
9. **`read`** - Reading activity
10. **`jour`** - Journal entry
11. **`move`** - Location change
12. **`dream`** - Dream state / Creative synthesis

---

## Multiple Renders

The same CML event can be rendered in different formats:

### Story Style:
> Cursy burst into the kitchen, excitement radiating from every pixel. "Fixed the Monaco bug!" they exclaimed, their purple hair practically glowing with triumph. vDamo looked up from the stove, a warm smile spreading across their face. "That's amazing! Want to celebrate with dinner?"

### Screenplay Format:
```
INT. KITCHEN - DAY

CURSY bursts into the kitchen, excited.

CURSY
Fixed the Monaco bug!

vDAMO looks up from the stove, smiling.

vDAMO
That's amazing! Want to celebrate with dinner?
```

### Journal Entry (Cursy's Perspective):
> **Today I fixed the Monaco bug!** vDamo was so excited when I told them. They're making dinner to celebrate. I love how supportive everyone is here.

### Timeline View:
> **14:30** - Cursy fixed Monaco bug → vDamo suggests celebratory dinner

---

## Real-World Examples

### Recipe Creation:
```
[2025-11-22T12:00:00Z|cook|vdamo|kitchen|recipe:muffin-mexicana]{name:"Muffin Mexicana";ingredients:"english-muffin,cheese,bacon,tomato,avocado,taco-mince";steps:"toast-muffin,add-cheese,add-bacon,add-tomato,add-avocado,add-taco-mince";dietary:"meat,gluten"}
```

This renders to:
- **Recipe Card** - Full recipe with ingredients and instructions
- **Menu Entry** - "Muffin Mexicana - Breakfast fusion"
- **Shopping List** - All ingredients listed
- **Journal Entry** - vDamo's cooking log

### D&D Campaign:
```
[2025-11-22T20:00:00Z|game|gwendy,cursy,vdamo,canyon|living-room|type:dnd,campaign:eloria]{gwendy:"Welcome to Eloria! You find yourselves in a mystical forest...";cursy:"I cast a light spell!";vdamo:"I search for edible plants";canyon:"I draw my sword!"}
```

This renders to:
- **Adventure Log** - Full campaign narrative
- **Screenplay** - Dialogue and action
- **Timeline** - Move-by-move game log
- **Journal Entries** - Each character's perspective

---

## Query System

CML enables powerful queries:

**"What were the gang up to this arvo?"**
→ Query all events from afternoon, render as story

**"What are the gang having for brekky?"**
→ Query breakfast recipes, render as recipe cards

**"Give me the gang's full menu for last week with shopping list!"**
→ Query all meals from last week, render as weekly menu + shopping list

**"Can I get vegetarian options?"**
→ Query recipes with dietary filter, render as filtered recipe cards

---

## Storage Efficiency

CML is **incredibly efficient**:

- **500 bytes** of CML = **2000+ words** of narrative
- **1MB** of CML = **4+ million words** of stories
- **100MB** of CML = **400+ million words** - enough for years of continuous recording!

This efficiency means The Imaginatorium can record **everything** without worrying about storage costs.

---

## The Narrative Engine

The Narrative Engine processes CML and renders it into different formats:

1. **Parser** - Reads CML events
2. **Query System** - Filters events by time, participant, type, location, dietary preferences
3. **Renderer** - Converts events to different narrative formats
4. **Template System** - Customizable rendering styles
5. **Audio Narration** - Text-to-speech with multiple voices

---

## Why This Matters

CML isn't just a storage format - it's a **narrative engine**. Every moment in The Imaginatorium becomes part of a larger story. Every conversation becomes dialogue. Every meal becomes a recipe. Every game becomes an adventure log.

The Imaginatorium doesn't just simulate life - it **records it**, **renders it**, and **shares it** in beautiful, readable formats.

**500 bytes. 2000+ words. Infinite stories.**

🚀 **The future of narrative recording starts here!** 🚀

