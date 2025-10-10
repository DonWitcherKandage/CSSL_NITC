# NITC 2025 Conference Real-Time Display System

## Quick Overview (Current Build)

- **Files you open**
  - `NITC 2025 - Folded LED Display.html` (512x863, two 256px panels)
  - `NITC 2025 - Folded 720x1080.html` (720x1080, two 360px panels)

- **What happens on each page**
  - **Left panel (Screen 1)** shows the agenda list.
    - 3 cards are visible at a time; the highlighted card rotates every 12 seconds in a loop.
    - Card time uses a neon gradient. Card titles use Inter. No hover/size changes.
  - **Right panel (Screen 2)** shows the live countdown and QR/Carousel.
    - Countdown targets the day’s first session time minus 2 hours.
    - When a day finishes (after the last item + ~30 min), the countdown automatically switches to the next day.
    - QR code block has a transparent background and a subtle neon border; caption “Scan for Details” and URL `nitc.lk` are white.

- **Fonts and headers**
  - Title (EVENT SCHEDULE, NITC 2025): Orbitron with a cyan gradient.
  - Subtitles/day labels/card titles: Inter.

- **Data source**
  - `model.js` contains the real dates (Inauguration, Day 1, Day 2) and full agenda.
  - `modepreview.js` reads `model.js` (if available) and drives both pages by calling:
    - `window.setDay(<day>)`
    - `window.setAgendaData([{displayTime,title}, ...])`
    - `window.setCountdownTarget(<YYYY-MM-DD>, <HH:MM or HH:MM AM/PM>)`
  - `NITC 2025 - Folded 720x1080.html` now exposes the same hooks and includes `modepreview.js`, so it stays in sync with the LED file.

- **Alignment and layout**
  - 720x1080 variant renders left-aligned (not centered) to match your other files.

- **How to change the schedule/dates**
  - Edit `model.js` only. Both displays update automatically via `modepreview.js`.
  - Alternatively, at runtime you can call `updateConferenceDates({ 'Inauguration': 'YYYY-MM-DD', 'Day 1': 'YYYY-MM-DD', 'Day 2': 'YYYY-MM-DD' })` in the console.

The detailed reference below describes the original MVC design and controls.

A professional dual-display conference agenda system with real-time Sri Lankan time tracking, smooth scaling animations, and manual navigation controls.
- **Real-Time Tracking**: Automatically follows Sri Lankan time (UTC+5:30)
- **Manual Navigation**: Full control over event display when needed
- **Smooth Animations**: Dramatic scaling effects with bouncy transitions
- **NITC 2025 Branding**: Professional design with particle effects
- **Cross-Display Sync**: Synchronized updates across all displays
- **Keyboard Controls**: Full keyboard navigation support

## System Architecture

- **MVC Design Pattern**: Model, View, Controller separation
- **Real-Time Mode**: Automatic schedule following (default)
- **Manual Mode**: User-controlled navigation
- **Universal View**: Single codebase for all display types

## File Structure

```
NITC-2025-Conference-Display/
├── index.html              # Combined view (both screens)
├── display1.html           # Agenda list only (left screen)
├── display2.html           # Event details only (right screen)
├── model.js                # Data layer and business logic
├── view.js                 # Presentation layer with animations
├── controller.js           # Logic coordination
├── app.js                  # Original combined application
├── app-display1.js         # Display 1 specific application
├── app-display2.js         # Display 2 specific application
├── styles.css              # All styling and animations
├── nitc-logo.png           # Conference logo
└── README.md               # This file
```

## Setup Instructions

### Single Computer Dual-Display Setup

1. **Connect Hardware**:
   - Connect two monitors to your computer
   - Set display mode to "Extend displays" (not mirror)
   - Arrange displays in correct order in system settings

2. **Open Browser Windows**:
   - Open two browser windows (Chrome/Firefox recommended)
   - Navigate first window to `display1.html`
   - Navigate second window to `display2.html`

3. **Position Windows**:
   - Drag first window to left monitor, press F11 for fullscreen
   - Drag second window to right monitor, press F11 for fullscreen

4. **Production Mode**:
   - Open browser console (F12)
   - Type `hideButtons()` to hide control buttons
   - Type `hideParticles()` to disable effects if needed

### Single Display Testing

- Open `index.html` for combined view with both screens side-by-side
- All features work identically to dual-display setup

## Operating Modes

### Real-Time Mode (Default)

**Behavior**:
- Automatically tracks Sri Lankan time (UTC+5:30)
- Displays current/next event based on actual schedule
- Conference runs 12:00 PM - 5:00 PM Sri Lankan time
- Updates every second

**Visual Indicators**:
- Button shows "Real-Time Mode" with dark styling
- Previous/Next buttons are disabled and grayed out
- Agenda item clicks are disabled

**Button Appearance**: Dark blue-grey background with border

### Manual Mode

**Behavior**:
- User controls which event is displayed
- Navigate freely through all agenda items
- Perfect for testing or presentations

**Visual Indicators**:
- Button shows "Manual Mode" with standard blue styling
- Previous/Next buttons are enabled (when applicable)
- Agenda items are clickable for direct navigation

**Button Appearance**: Standard blue background

## Control Methods

### Mouse Controls

| Action | Real-Time Mode | Manual Mode |
|--------|----------------|-------------|
| Click "Real-Time Mode" button | Switches to Manual | N/A |
| Click "Manual Mode" button | N/A | Switches to Real-Time |
| Click "← Previous" button | Disabled | Go to previous event |
| Click "Next →" button | Disabled | Go to next event |
| Click agenda items | Disabled | Jump to specific event |

### Keyboard Controls

**Available in ALL modes** (even when buttons are hidden):

| Key | Function | Works When |
|-----|----------|------------|
| **T** | Toggle between Real-Time/Manual modes | Always |
| **R** | Force return to Real-Time mode | Always |
| **←** (Left Arrow) | Previous event | Manual mode only |
| **→** (Right Arrow) | Next event | Manual mode only |
| **H** | Hide/show control buttons | Always |
| **D** | Toggle debug panel | Always |

### Console Commands

**Available via browser console (F12)**:

```javascript
// Mode Control
hideButtons()           // Hide all control buttons (production)
showButtons()           // Show control buttons (testing)

// System Information  
getStatus()             // Display current system status
getSchedule()           // Show full conference schedule
restartSystem()         // Restart the entire system

// Conference Day Control
setDay("Inauguration")  // Switch to Inauguration day
setDay("Day 1")         // Switch to Day 1
setDay("Day 2")         // Switch to Day 2

// Visual Effects
hideParticles()         // Hide particle effects
showParticles()         // Show particle effects

// Direct Navigation (for testing)
goToEvent(3)            // Jump to event index 3
```

## Animation System

### Timing Differences

- **Real-Time Mode**: 2.5-second dramatic animations
- **Manual Mode**: 2.0-second responsive animations
- **Scaling Effects**: Up to 1.20x size increase
- **Bouncy Easing**: Elastic cubic-bezier curves

### Animation Elements

- Current event card scaling and highlighting
- Event time dramatic scaling on details screen
- Event title smooth transitions
- Staggered element animations (0.3s, 0.6s, 0.8s delays)
- Smooth opacity and transform effects

## Conference Schedule

### Inauguration Day (Default)
- **Time**: 12:00 PM - 5:00 PM
- **Events**: 10 agenda items
- **Auto-tracking**: Based on Sri Lankan time

### Day 1 & Day 2
- Switch using `setDay()` command or manual configuration
- Full multi-day support with separate agendas

## Technical Details

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge
- **Requirements**: ES6+ support, localStorage
- **Particles**: tsParticles library (CDN loaded)

### Performance
- **Update Frequency**: 1-second intervals
- **Cross-Display Sync**: localStorage communication
- **Animation Optimization**: CSS transforms and opacity only
- **Memory Management**: Automatic cleanup on page unload

### Customization

**Logo Replacement**:
- Replace `nitc-logo.png` with your logo
- Recommended size: 200px width maximum

**Schedule Modification**:
- Edit agenda data in `model.js`
- Update time format: 24-hour (HH:MM)
- Add/remove events as needed

**Styling Changes**:
- Modify colors, fonts, sizes in `styles.css`
- Particle effects configurable in app files

## Troubleshooting

### Common Issues

**Displays not syncing**:
- Check localStorage permissions
- Ensure both windows are from same domain
- Refresh both displays

**Animations not working**:
- Verify CSS file is loaded
- Check browser console for errors
- Try `restartSystem()` command

**Buttons not responding**:
- Use keyboard controls as backup
- Check if buttons are hidden (`showButtons()`)
- Verify JavaScript files are loaded

**Real-time not updating**:
- Check system time and timezone
- Verify network connection
- Use `getStatus()` to check system state

### Emergency Controls

If the system becomes unresponsive:

1. **Keyboard Reset**: Press `R` to force Real-Time mode
2. **Console Reset**: Type `restartSystem()`
3. **Browser Reset**: Refresh page (Ctrl+F5 or Cmd+Shift+R)
4. **Show Controls**: Press `H` or type `showButtons()`

## Development

### Adding New Features
- Follow MVC pattern
- Update all three layers (Model, View, Controller)
- Test on both single and dual displays

### Animation Customization
- Modify timing in `view.js` `triggerEventChangeAnimation()`
- Update CSS transitions in `styles.css`
- Test both Real-Time and Manual modes

## Production Deployment

1. **Pre-Setup**:
   - Test all functions with `showButtons()`
   - Verify schedule data accuracy
   - Check logo and branding

2. **Go Live**:
   - Run `hideButtons()` to clean interface
   - Position displays and go fullscreen
   - Monitor with `getStatus()` if needed

3. **During Event**:
   - System runs automatically in Real-Time mode
   - Use keyboard controls if manual override needed
   - Emergency controls available via console

## Support

For technical issues or customization requests:
- Check browser console for error messages
- Use `getStatus()` for system diagnostics
- Verify all files are in the same directory
- Ensure stable internet for particle effects

---

**NITC 2025 Conference Display System**  
*Professional dual-display solution with real-time tracking and manual control*