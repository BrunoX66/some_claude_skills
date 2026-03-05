---
title: "AI Assistant Patterns: The Clippy Paradigm"
sidebar_label: "AI Assistant Patterns: The Cli..."
sidebar_position: 2
---
# AI Assistant Patterns: The Clippy Paradigm

How Windows 95 would present AI assistants, chatbots, and intelligent agents.

## Core Philosophy

Win95 AI is **proactive, character-based, and wizard-driven**. Not the modern chat paradigm—but the Office Assistant paradigm extended.

Key principles:
1. **Character avatar** - Not faceless chat bubbles
2. **Proactive suggestions** - "It looks like you're..."
3. **Wizard flows** - Step-by-step, not freeform
4. **Constrained choices** - Radio buttons, not open text
5. **Dismissable tips** - "Don't show me this again"

---

## The AI Assistant Window

```
┌─ Assistant ─────────────────────────────[−][□][×]─┐
│ ┌────────────────────────────────────────────────┐│
│ │                                                ││
│ │  ┌─────────────────┐                           ││
│ │  │                 │                           ││
│ │  │  [Character]    │  Message text goes here   ││
│ │  │  Animation      │  with helpful suggestions ││
│ │  │                 │  and guidance.            ││
│ │  └─────────────────┘                           ││
│ │                                                ││
│ │  ○ Option one - Description of this choice    ││
│ │  ○ Option two - Description of this choice    ││
│ │  ○ Don't show me this tip again               ││
│ │                                                ││
│ └────────────────────────────────────────────────┘│
│  □ Always show tips on startup  [ OK ] [Cancel]  │
└──────────────────────────────────────────────────┘
```

### CSS Implementation

```css
.win95-assistant {
  width: 420px;
  background: var(--win95-gray);
  border: 2px solid;
  border-color: var(--win95-highlight) var(--win95-dark-shadow)
               var(--win95-dark-shadow) var(--win95-highlight);
  box-shadow: 4px 4px 0 var(--win95-dark-shadow);
}

.win95-assistant-content {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #ffffcc; /* Yellow tip background */
  margin: 8px;
  border: 1px solid var(--win95-shadow);
}

.win95-assistant-avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  /* Animated character goes here */
}

.win95-assistant-message {
  flex: 1;
  font-size: 11px;
  line-height: 1.4;
}

.win95-assistant-options {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.win95-assistant-option {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.win95-assistant-option input[type="radio"] {
  margin-top: 2px;
}
```

---

## Tip of the Day Pattern

For startup tips, daily suggestions, or onboarding:

```
┌─ Tip of the Day ─────────────────────────────[×]─┐
│                                                   │
│  ┌───────────────────────────────────────────┐   │
│  │  💡                                       │   │
│  │                                           │   │
│  │  Did you know?                            │   │
│  │                                           │   │
│  │  You can press F1 at any time to get     │   │
│  │  help with the current task.             │   │
│  │                                           │   │
│  └───────────────────────────────────────────┘   │
│                                                   │
│  □ Show tips at startup                          │
│                                                   │
│              [Previous] [Next] [Close]           │
└───────────────────────────────────────────────────┘
```

---

## Wizard Flow Pattern

For multi-step AI interactions (setup, configuration, complex tasks):

```
┌─ Setup Wizard ───────────────────────────────[×]─┐
│                                                   │
│  ┌───┐                                           │
│  │ 🔮│  Step 2 of 4: Choose Your Assistant      │
│  └───┘                                           │
│  ──────────────────────────────────────────────  │
│                                                   │
│  Select the assistant personality that best      │
│  matches your work style:                        │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │ ○ 📎 Clippy - Helpful and proactive     │   │
│  │ ○ 🐕 Rover - Searches for answers       │   │
│  │ ○ 🧙 Merlin - Magical assistance        │   │
│  │ ○ 🤖 Bot - Direct and efficient         │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  ═══════════════════════════════════════════════ │
│  [< Back]                      [Next >] [Cancel] │
└───────────────────────────────────────────────────┘
```

### Wizard Progress Indicator

```css
.win95-wizard-steps {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 16px;
}

.win95-wizard-step {
  width: 12px;
  height: 12px;
  background: var(--win95-gray);
  border: 1px solid var(--win95-shadow);
}

.win95-wizard-step.active {
  background: var(--win95-title-dark);
}

.win95-wizard-step.completed {
  background: var(--win95-selection);
}
```

---

## Chat Interface (Win95 Style)

When you need actual chat, style it as a "Message Center" window:

```
┌─ Message Center ─────────────────────────[−][□][×]─┐
│ File  Edit  View  Help                              │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ From: Assistant                      10:45 AM  │ │
│ │ ─────────────────────────────────────────────  │ │
│ │ Hello! How can I help you today?               │ │
│ │                                                 │ │
│ │ From: You                            10:46 AM  │ │
│ │ ─────────────────────────────────────────────  │ │
│ │ Can you help me write a letter?                │ │
│ │                                                 │ │
│ │ From: Assistant                      10:46 AM  │ │
│ │ ─────────────────────────────────────────────  │ │
│ │ Of course! I'd be happy to help.               │ │
│ │                                                 │ │
│ │ Would you like to:                              │ │
│ │ • Start a new letter from scratch              │ │
│ │ • Use a template                                │ │
│ │ • Open a recent letter                          │ │
│ │                                                 │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Type your message here...                      │ │
│ └─────────────────────────────────────────────────┘ │
│                                           [Send]    │
├─────────────────────────────────────────────────────┤
│ Ready                                    Messages: 3│
└─────────────────────────────────────────────────────┘
```

### Message Styling

```css
.win95-message-center {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.win95-message-list {
  flex: 1;
  overflow-y: auto;
  background: white;
  border: 2px inset var(--win95-gray);
  padding: 4px;
}

.win95-message {
  margin-bottom: 8px;
  font-size: 11px;
}

.win95-message-header {
  font-weight: bold;
  color: var(--win95-title-dark);
  border-bottom: 1px solid var(--win95-shadow);
  padding-bottom: 2px;
  margin-bottom: 4px;
}

.win95-message-body {
  padding-left: 8px;
}

.win95-message-input {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-top: 2px solid var(--win95-shadow);
}

.win95-message-input input {
  flex: 1;
}
```

---

## Balloon Tooltips (System Tray Notifications)

For non-intrusive AI suggestions:

```
                                    ┌─────────────────────────┐
                                    │ 💡 Assistant            │
                                    │ ───────────────────     │
                                    │ You have 3 unread      │
                                    │ suggestions waiting.   │
                                    │                         │
                                    │ Click here to view.    │
                                    └─────────────────────────┘
                                           △
                                    [🔔] [📶] [🔋] 3:45 PM
```

```css
.win95-balloon {
  position: absolute;
  bottom: 36px;
  right: 8px;
  width: 200px;
  background: #ffffe1; /* Tooltip yellow */
  border: 1px solid var(--win95-dark-shadow);
  padding: 8px;
  font-size: 11px;
  box-shadow: 2px 2px 0 var(--win95-shadow);
}

.win95-balloon::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 20px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #ffffe1;
}

.win95-balloon-title {
  font-weight: bold;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

---

## Error and Confirmation Dialogs

AI responses that need user action:

```
┌─ Error ──────────────────────────────────────[×]─┐
│                                                   │
│    ╔════╗                                        │
│    ║ ⛔ ║  The assistant encountered an error.   │
│    ╚════╝                                        │
│                                                   │
│           Would you like to try again?           │
│                                                   │
│          [Retry]  [Cancel]  [Details >>]         │
└───────────────────────────────────────────────────┘
```

### Icon Mapping

| Intent | Win95 Icon | Modern Equivalent |
|--------|------------|-------------------|
| Error | ⛔ (red circle with X) | ❌ |
| Warning | ⚠️ (yellow triangle) | ⚠️ |
| Question | ❓ (blue question mark) | ❓ |
| Info | ℹ️ (blue i in circle) | ℹ️ |
| Success | ✅ (green checkmark) | ✅ |

---

## Animated Characters

Win95 assistants had idle animations. Modern web equivalent:

```css
.win95-assistant-avatar {
  width: 64px;
  height: 64px;
  animation: assistant-idle 2s ease-in-out infinite;
}

@keyframes assistant-idle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.win95-assistant-avatar.thinking {
  animation: assistant-think 0.5s ease-in-out infinite;
}

@keyframes assistant-think {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.win95-assistant-avatar.celebrating {
  animation: assistant-celebrate 0.3s ease-in-out 3;
}

@keyframes assistant-celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

---

## Voice/Audio Patterns

Win95 had system sounds. Map to AI events:

| Event | Win95 Sound | Modern Equivalent |
|-------|-------------|-------------------|
| Message received | ding.wav | Notification chime |
| Error | chord.wav | Error tone |
| Success | tada.wav | Success fanfare |
| Thinking | None (but could add) | Subtle processing sound |
| Assistant appears | whoosh | Pop-in sound |

```javascript
const sounds = {
  message: new Audio('/sounds/ding.wav'),
  error: new Audio('/sounds/chord.wav'),
  success: new Audio('/sounds/tada.wav'),
};

function playSound(type) {
  if (sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play();
  }
}
```
