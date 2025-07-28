# Restaurant Combo Generator

Simple restaurant combo meal generator.

## Features

- Generate 3 unique combos per day
- Each combo: main course + side dish + drink
- Total calories: 550-800 per combo
- All items unique per day

## How to Run

1. Install: `npm install`
2. Start: `npm start`
3. Open: `http://localhost:3000`

## Files

- `server.js` - Simple Express backend
- `index.html` - Minimal HTML/CSS/JS
- `master-menu.json` - Menu data
- `package.json` - Dependencies

## How it Works

1. Select a day from dropdown
2. Click "Generate Combos"
3. Backend randomly picks items
4. Validates calories (550-800)
5. Ensures unique items
6. Returns 3 combos 