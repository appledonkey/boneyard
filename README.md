# 🎲 The Boneyard

A modern, mobile-first game hub for domino and dice games built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎮 Game Portal
- **Beautiful Home Screen** with animated portals for Dominoes and Dice games
- **Smooth Transitions** and responsive design that works flawlessly on mobile and desktop
- **Dark Mode** by default with a bone-themed color palette

### 🀀 Domino Games
- **Draw Game** (fully playable with AI opponent OR multiplayer)
  - Touch-optimized drag-and-drop using @dnd-kit
  - Snap-to-grid placement with visual feedback
  - Valid move highlighting
  - Smooth animations for domino placement
  - AI opponent with basic strategy
  - Win condition detection
  - **Real-time Multiplayer** via WebSocket
- **Additional Games** (Coming Soon): Block, Mexican Train, Chickenfoot

### 🌐 Multiplayer Features
- **Real-time WebSocket Multiplayer** using Socket.io
  - Create or join game rooms with 6-letter codes
  - Support for 2-4 players per room
  - Real-time game state synchronization
  - Player presence indicators (online/offline)
  - Host controls for starting games
  - Automatic reconnection handling
- **Lobby System**
  - Easy room creation and joining
  - Shareable room codes
  - Player list with host indicator
  - Waiting room with "Start Game" for host

### 🎲 Dice Games
- **3D Dice Roller** with realistic physics
  - Built with Three.js and React Three Fiber
  - Gravity and bounce physics simulation
  - Smooth rolling animations
  - Result calculation
- **Additional Games** (Coming Soon): Yahtzee, Farkle, Liar's Dice, Craps

### 🛍️ In-App Store
- **Cosmetic Items** for customization (no gameplay advantages)
  - Domino Sets (Classic Ivory, Midnight Black, Jade Emperor)
  - Dice Sets (Classic White, Ruby Red, Crystal Clear)
  - Table Themes (Green Felt, Mahogany Wood, White Marble)
  - Backgrounds (The Boneyard, Desert Sunset, Neon Nights)
- **Mock Purchase Flow** (Stripe integration ready)
- **Inventory Management** with localStorage persistence

### 🎨 UX/UI Excellence
- **Sound Effects** using Web Audio API (dice rolls, domino placement, success sounds)
- **Haptic Feedback** on mobile devices
- **Tutorial Overlays** for first-time players
- **Smooth Animations** powered by Framer Motion
- **Touch-Optimized** controls with gesture support
- **60fps Performance** target

### 👤 User System
- **Anonymous Play** with auto-generated guest names
- **Local Storage** for guest player data and settings
- **Settings Management** (sound, haptics, dark mode, animation speed)
- OAuth integration ready (Google, GitHub, Apple)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/appledonkey/boneyard.git
cd boneyard
```

2. Install dependencies for both client and server:
```bash
npm install
cd server && npm install && cd ..
```

3. Start the development servers:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend (for multiplayer):**
```bash
cd server
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Game Features
- **@dnd-kit** - Drag and drop functionality
- **Three.js** - 3D graphics for dice
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Framer Motion** - Animation library

### State Management
- **Zustand** - Lightweight state management
- **React Context** - For audio and game settings

### Multiplayer & Backend
- **Socket.io** - Real-time multiplayer (✅ Implemented!)
- **Express** - Backend server for game rooms
- **WebSocket** - Bi-directional client-server communication

### Future Additions (Ready for Integration)
- **Supabase/Firebase** - User auth and persistent data
- **Stripe** - Payment processing for cosmetics

## 📱 Mobile Optimization

The Boneyard is designed mobile-first with:
- Touch-optimized drag-and-drop
- Haptic feedback via Vibration API
- No text selection or callouts during gameplay
- Smooth 60fps animations
- Responsive layouts that adapt to any screen size
- PWA capabilities (installable on mobile)

## 🎯 Game Rules

### Draw (Domino Game)
1. Each player starts with 7 dominoes
2. Match the pips on your domino to either end of the chain
3. If you can't play, draw from the boneyard
4. First player to empty their hand wins!

### Multiplayer Draw (How to Play)
1. Navigate to Domino Games → Multiplayer Draw
2. **Create a Room**: Click "Create Room" to host a game
   - Share the 6-letter room code with friends
   - Wait for players to join (2-4 players)
   - Click "Start Game" when ready
3. **Join a Room**: Click "Join Room" and enter the code
   - Wait for the host to start the game
4. Gameplay follows standard Draw rules with turn-based play
5. Connection status shows which players are online

### Dice Roller
- Roll two dice with realistic physics
- Dice tumble and bounce on the table
- Results are calculated when dice settle

## 📂 Project Structure

```
boneyard/
├── src/
│   ├── components/
│   │   ├── domino/         # Domino game components
│   │   ├── dice/           # Dice game components
│   │   └── Layout.tsx      # App layout wrapper
│   ├── contexts/
│   │   ├── AudioContext.tsx    # Sound effects & haptics
│   │   └── GameContext.tsx     # Game state & settings
│   ├── hooks/
│   │   ├── useDrawGame.ts      # Single-player Draw game logic
│   │   └── useMultiplayer.ts   # Multiplayer WebSocket hook
│   ├── pages/
│   │   ├── Home.tsx                # Landing page
│   │   ├── DominoGames.tsx         # Domino game selection
│   │   ├── DiceGames.tsx           # Dice game selection
│   │   ├── MultiplayerLobby.tsx    # Multiplayer lobby
│   │   ├── Store.tsx               # In-app store
│   │   └── games/
│   │       ├── DrawGame.tsx        # Single-player Draw
│   │       └── DrawMultiplayer.tsx # Multiplayer Draw
│   ├── types/
│   │   └── domino.ts           # Type definitions
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── server/                     # Multiplayer backend
│   ├── index.js                # Socket.io server
│   └── package.json            # Server dependencies
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 Color Palette

The "bone" theme:
- `bone-50` to `bone-900` - Warm, earthy tones
- Dark mode optimized for comfortable gaming
- Accent colors for valid moves, success states, etc.

## 🔮 Roadmap

### Phase 1 ✅ COMPLETE
- ✅ Home screen and navigation
- ✅ Draw domino game with AI
- ✅ Basic dice roller with physics
- ✅ Store mockup
- ✅ Sound effects and haptics

### Phase 2 ✅ COMPLETE
- ✅ WebSocket multiplayer for Draw game
- ✅ Lobby system with private room codes
- ✅ Real-time game synchronization
- ✅ Player presence indicators

### Phase 3 (Next)
- [ ] Additional domino games (Block, Mexican Train)
- [ ] Complete Yahtzee implementation
- [ ] Tournament mode for multiplayer

### Phase 4 (Future)
- [ ] User authentication (OAuth)
- [ ] Persistent user accounts (Supabase)
- [ ] Real payment processing (Stripe)
- [ ] Leaderboards and statistics
- [ ] More dice games (Farkle, Liar's Dice, Craps)
- [ ] Spectator mode
- [ ] Game replays

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🎮 Play Now

Visit [The Boneyard](https://boneyard.example.com) to start playing!

---

Made with ❤️ for domino and dice enthusiasts everywhere
