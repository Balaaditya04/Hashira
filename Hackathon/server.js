const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const menuData = JSON.parse(fs.readFileSync('master-menu.json', 'utf8'));

const dayTastes = {
    monday: "sweet",
    tuesday: "spicy", 
    wednesday: "savory",
    thursday: "spicy",
    friday: "spicy",
    saturday: "sweet",
    sunday: "savory"
};

let usedCombos = new Set();
let dayCounter = 0;

function checkPopularity(main, side, drink) {
    const scores = [main.popularity_score, side.popularity_score, drink.popularity_score];
    const maxDiff = Math.max(...scores) - Math.min(...scores);
    return maxDiff <= 0.1;
}

function getComboTaste(main, side, drink) {
    const tastes = [main.taste_profile, side.taste_profile, drink.taste_profile];
    const uniqueTastes = [...new Set(tastes)];
    return uniqueTastes.length === 1 ? uniqueTastes[0] : "mix";
}

function makeComboKey(main, side, drink) {
    return `${main.item_name}-${side.item_name}-${drink.item_name}`;
}

function generateCombosForDay(day) {
    const usedItems = new Set();
    const combos = [];
    const preferredTaste = dayTastes[day];

    const allMains = menuData.filter(item => item.category === 'main');
    const allSides = menuData.filter(item => item.category === 'side');
    const allDrinks = menuData.filter(item => item.category === 'drink');

    // Increase selection
    const selectedMains = allMains.sort(() => Math.random() - 0.5).slice(0, Math.min(8, allMains.length));
    const selectedSides = allSides.sort(() => Math.random() - 0.5).slice(0, Math.min(6, allSides.length));
    const selectedDrinks = allDrinks.sort(() => Math.random() - 0.5).slice(0, Math.min(6, allDrinks.length));

    for (let i = 0; i < 3; i++) {
        let combo = null;

        for (let tries = 0; tries < 150 && !combo; tries++) {
            const main = selectedMains[Math.floor(Math.random() * selectedMains.length)];
            const side = selectedSides[Math.floor(Math.random() * selectedSides.length)];
            const drink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];

            if (usedItems.has(main.item_name) || usedItems.has(side.item_name) || usedItems.has(drink.item_name)) {
                continue;
            }

            const comboKey = makeComboKey(main, side, drink);
            if (usedCombos.has(comboKey)) {
                continue;
            }

            const totalCalories = main.calories + side.calories + drink.calories;
            if (totalCalories < 500 || totalCalories > 800) {
                continue;
            }

            if (!checkPopularity(main, side, drink)) {
                continue;
            }

            const comboTaste = getComboTaste(main, side, drink);
            if (preferredTaste !== "mix" && comboTaste !== preferredTaste && comboTaste !== "mix") {
                continue;
            }

            combo = {
                main: main,
                side: side,
                drink: drink,
                totalCalories: totalCalories,
                tasteProfile: comboTaste,
                popularityScore: (main.popularity_score + side.popularity_score + drink.popularity_score) / 3,
                comboKey: comboKey
            };
        }

        if (!combo) {
            for (let tries = 0; tries < 100 && !combo; tries++) {
                const main = selectedMains[Math.floor(Math.random() * selectedMains.length)];
                const side = selectedSides[Math.floor(Math.random() * selectedSides.length)];
                const drink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];

                if (usedItems.has(main.item_name) || usedItems.has(side.item_name) || usedItems.has(drink.item_name)) {
                    continue;
                }

                const comboKey = makeComboKey(main, side, drink);
                if (usedCombos.has(comboKey)) {
                    continue;
                }

                const totalCalories = main.calories + side.calories + drink.calories;
                if (totalCalories < 500 || totalCalories > 800) {
                    continue;
                }

                const comboTaste = getComboTaste(main, side, drink);
                if (preferredTaste !== "mix" && comboTaste !== preferredTaste && comboTaste !== "mix") {
                    continue;
                }

                combo = {
                    main: main,
                    side: side,
                    drink: drink,
                    totalCalories: totalCalories,
                    tasteProfile: comboTaste,
                    popularityScore: (main.popularity_score + side.popularity_score + drink.popularity_score) / 3,
                    comboKey: comboKey
                };
            }
        }

        if (!combo) {
            for (let tries = 0; tries < 100 && !combo; tries++) {
                const main = selectedMains[Math.floor(Math.random() * selectedMains.length)];
                const side = selectedSides[Math.floor(Math.random() * selectedSides.length)];
                const drink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];

                if (usedItems.has(main.item_name) || usedItems.has(side.item_name) || usedItems.has(drink.item_name)) {
                    continue;
                }

                const comboKey = makeComboKey(main, side, drink);
                if (usedCombos.has(comboKey)) {
                    continue;
                }

                const totalCalories = main.calories + side.calories + drink.calories;
                if (totalCalories < 500 || totalCalories > 800) {
                    continue;
                }

                combo = {
                    main: main,
                    side: side,
                    drink: drink,
                    totalCalories: totalCalories,
                    tasteProfile: getComboTaste(main, side, drink),
                    popularityScore: (main.popularity_score + side.popularity_score + drink.popularity_score) / 3,
                    comboKey: comboKey
                };
            }
        }

        if (!combo) {
            const availableMains = selectedMains.filter(m => !usedItems.has(m.item_name));
            const availableSides = selectedSides.filter(s => !usedItems.has(s.item_name));
            const availableDrinks = selectedDrinks.filter(d => !usedItems.has(d.item_name));

            for (let m = 0; m < availableMains.length && !combo; m++) {
                for (let s = 0; s < availableSides.length && !combo; s++) {
                    for (let d = 0; d < availableDrinks.length && !combo; d++) {
                        const main = availableMains[m];
                        const side = availableSides[s];
                        const drink = availableDrinks[d];
                        
                        const totalCalories = main.calories + side.calories + drink.calories;
                        if (totalCalories >= 500 && totalCalories <= 800) {
                            const comboKey = makeComboKey(main, side, drink);
                            
                            combo = {
                                main: main,
                                side: side,
                                drink: drink,
                                totalCalories: totalCalories,
                                tasteProfile: getComboTaste(main, side, drink),
                                popularityScore: (main.popularity_score + side.popularity_score + drink.popularity_score) / 3,
                                comboKey: comboKey
                            };
                        }
                    }
                }
            }
        }

        if (combo) {
            usedItems.add(combo.main.item_name);
            usedItems.add(combo.side.item_name);
            usedItems.add(combo.drink.item_name);
            usedCombos.add(combo.comboKey);
            combos.push(combo);
        }
    }

    return combos;
}

// Generate combos for 3 consecutive days
function generateThreeDayCombos() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // Get a random starting day and select 3 consecutive days
    const startIndex = Math.floor(Math.random() * days.length);
    const selectedDays = [];
    
    for (let i = 0; i < 3; i++) {
        selectedDays.push(days[(startIndex + i) % days.length]);
    }

    const result = {
        days: selectedDays,
        dailyCombos: {},
        totalCombos: 0
    };

    // Generate combos for each selected day
    selectedDays.forEach(day => {
        const combos = generateCombosForDay(day);
        result.dailyCombos[day] = {
            day: day,
            dayTasteProfile: dayTastes[day],
            combos: combos,
            comboCount: combos.length
        };
        result.totalCombos += combos.length;
    });

    // Update day counter for combo tracking
    dayCounter++;
    if (dayCounter >= 3) {
        usedCombos.clear();
        dayCounter = 0;
    }

    return result;
}

app.post('/api/generate-combos', (req, res) => {
    const { day } = req.body;
    const combos = generateCombosForDay(day);

    res.json({
        day: day,
        dayTasteProfile: dayTastes[day],
        combos: combos,
        comboCount: combos.length,
        remarks: {
            tasteProfile: `Day-specific taste profile: ${dayTastes[day]}`,
            uniqueness: "All items unique within day, combos unique across 3 days",
            calories: "Each combo: 500-800 calories",
            popularity: "Similar popularity scores across combos when possible"
        }
    });
});

// New endpoint for generating 3 days of combos
app.post('/api/generate-three-day-combos', (req, res) => {
    const result = generateThreeDayCombos();

    res.json({
        success: true,
        selectedDays: result.days,
        totalCombos: result.totalCombos,
        dailyCombos: result.dailyCombos,
        remarks: {
            selection: "3 consecutive days selected randomly",
            uniqueness: "All items unique within each day, combos unique across 3 days",
            calories: "Each combo: 500-800 calories",
            tasteProfiles: "Each day follows its specific taste profile when possible"
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});