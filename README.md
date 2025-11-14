# 🎲 The Boneyard

A modern, mobile-first game hub for domino and dice games built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎮 Game Portal
- **Beautiful Home Screen** with animated portals for Dominoes and Dice games
- **Smooth Transitions** and responsive design that works flawlessly on mobile and desktop
- **Dark Mode** by default with a bone-themed color palette

### 🀀 Domino Games
- **Draw Game** (fully playable with AI opponent)
  - Touch-optimized drag-and-drop using @dnd-kit
  - Snap-to-grid placement with visual feedback
  - Valid move highlighting
  - Smooth animations for domino placement
  - AI opponent with basic strategy
  - Win condition detection
- **Additional Games** (Coming Soon): Block, Mexican Train, Chickenfoot

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

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
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

### Future Additions (Ready for Integration)
- **Socket.io** - Real-time multiplayer
- **Supabase/Firebase** - Backend, auth, and database
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
│   │   └── useDrawGame.ts      # Draw game logic
│   ├── pages/
│   │   ├── Home.tsx            # Landing page
│   │   ├── DominoGames.tsx     # Domino game selection
│   │   ├── DiceGames.tsx       # Dice game selection
│   │   ├── Store.tsx           # In-app store
│   │   └── games/
│   │       └── DrawGame.tsx    # Draw domino game
│   ├── types/
│   │   └── domino.ts           # Type definitions
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
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

### Phase 1 (Current)
- ✅ Home screen and navigation
- ✅ Draw domino game with AI
- ✅ Basic dice roller with physics
- ✅ Store mockup
- ✅ Sound effects and haptics

### Phase 2 (Next)
- [ ] WebSocket multiplayer for Draw game
- [ ] Lobby system with private rooms
- [ ] Additional domino games (Block, Mexican Train)
- [ ] Complete Yahtzee implementation

### Phase 3 (Future)
- [ ] User authentication (OAuth)
- [ ] Backend integration (Supabase)
- [ ] Real payment processing
- [ ] Leaderboards and statistics
- [ ] More dice games (Farkle, Liar's Dice, Craps)
- [ ] Tournament mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🎮 Play Now

Visit [The Boneyard](https://boneyard.example.com) to start playing!

---

Made with ❤️ for domino and dice enthusiasts everywhere
