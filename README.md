# Phantom Hack

A harmless, mobile-first "hacker" prank built with React + Vite. It is a purely visual simulation:
no backend, no permissions requests, no files, no private data. After 30 seconds it reveals the prank.

## Run locally
```bash
npm install
npm run dev        # opens on http://localhost:5173 (also exposed on your LAN for phone testing)
```
Open the LAN URL printed by Vite on an Android phone on the same Wi-Fi.

## Build / deploy
```bash
npm run build      # outputs ./dist
```
- **Vercel:** import the repo, framework preset "Vite" (build `npm run build`, output `dist`).
- **Netlify:** `netlify.toml` is included; connect the repo or drag-drop the `dist` folder.

## How it behaves
- Direct Start: Opening the link directly launches into the simulated security breach.
- No Exit button: Keeps the prank convincing during the countdown.
- Sound & Vibration: Audio context initializes and automatically unlocks on first touch/tap on the screen.
- At the end of the 30-second countdown, the funny reveal screen appears.
- If you ever need the setup screen, you can visit with `?setup=1`.

## Structure
```
src/App.jsx                  stage state machine (start → scan → reveal)
src/components/              StartScreen, ScanScreen, RevealScreen, TerminalLog, ProgressBar, GlitchText, Overlay
src/lib/sfx.js               WebAudio beeps + vibration helper
src/lib/fullscreen.js        fullscreen helpers
src/styles.css               all styling and animations (respects prefers-reduced-motion)
```
