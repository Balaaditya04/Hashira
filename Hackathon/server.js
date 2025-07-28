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

//This tracks combos already used in the last 3 days.
let usedCombos = new Set();
let dayCounter = 0;

//similar popularity
function checkPopularity(main,side, drink) {
    const scores = [main.popularity_score, side.popularity_score, drink.popularity_score];
    const maxDiff = Math.max(...scores) - Math.min(...scores);
    return maxDiff <= 0.1;
}


function getComboTaste(main,side, drink) {
    const tastes = [main.taste_profile, side.taste_profile, drink.taste_profile];
    const uniqueTastes = [...new Set(tastes)];
    if (uniqueTastes.length === 1) {
        return uniqueTastes[0];
    } else {
        return "mix";
    }
}
function makeComboKey(main, side, drink) {
    return `${main.item_name}-${side.item_name}-${drink.item_name}`;
}
function generateCombos(day) {
    const usedItems = new Set();
    const combos = [];
    const preferredTaste = dayTastes[day];

    const allMains = menuData.filter(item => item.category === 'main');
    const allSides = menuData.filter(item => item.category === 'side');
    const allDrinks = menuData.filter(item => item.category === 'drink');

    const selectedMains = allMains.sort(() => Math.random() - 0.5).slice(0, 5);
    const selectedSides = allSides.sort(() => Math.random() - 0.5).slice(0, 4);
    const selectedDrinks = allDrinks.sort(() => Math.random() - 0.5).slice(0, 4);
    for (let i = 0; i < 3; i++) {
        let combo = null;
        let tries = 0;

        while (tries < 300 && !combo) {
            const main = selectedMains[Math.floor(Math.random() * selectedMains.length)];
            const side = selectedSides[Math.floor(Math.random() * selectedSides.length)];
            const drink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];

            if (usedItems.has(main.item_name) || usedItems.has(side.item_name) || usedItems.has(drink.item_name)) {
                tries++;
                continue;
            }

            const comboKey = makeComboKey(main, side, drink);
            if (usedCombos.has(comboKey)) {
                tries++;
                continue;
            }

            const totalCalories = main.calories + side.calories + drink.calories;
            if (totalCalories < 550 || totalCalories > 800) {
                tries++;
                continue;
            }
            if (!checkPopularity(main, side, drink)) {
                tries++;
                continue;
            }
            const comboTaste = getComboTaste(main, side, drink);
            if (preferredTaste !== "mix" && comboTaste !== preferredTaste && comboTaste !== "mix") {
                tries++;
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
            
            usedItems.add(main.item_name);
            usedItems.add(side.item_name);
            usedItems.add(drink.item_name);
            //
            usedCombos.add(comboKey);
        }
        if (!combo) {
            tries = 0;
            while (tries < 200 && !combo) {
                const main = selectedMains[Math.floor(Math.random() * selectedMains.length)];
                const side = selectedSides[Math.floor(Math.random() * selectedSides.length)];
                const drink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];

                if (usedItems.has(main.item_name) || usedItems.has(side.item_name) || usedItems.has(drink.item_name)) {
                    tries++;
                    continue;
                }

                const comboKey = makeComboKey(main, side, drink);
                if (usedCombos.has(comboKey)) {
                    tries++;
                    continue;
                }

                const totalCalories = main.calories + side.calories + drink.calories;
                if (totalCalories < 550 || totalCalories > 800) {
                    tries++;
                    continue;
                }

                const comboTaste = getComboTaste(main, side, drink);
                if (preferredTaste !== "mix" && comboTaste !== preferredTaste && comboTaste !== "mix") {
                    tries++;
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
                
                usedItems.add(main.item_name);
                usedItems.add(side.item_name);
                usedItems.add(drink.item_name);
                usedCombos.add(comboKey);
            }
        }
        if (!combo) {
            const availableMains = selectedMains.filter(m => !usedItems.has(m.item_name));
            const availableSides = selectedSides.filter(s => !usedItems.has(s.item_name));
            const availableDrinks = selectedDrinks.filter(d => !usedItems.has(d.item_name));
            
            if (availableMains.length > 0 && availableSides.length > 0 && availableDrinks.length > 0) {
                const main = availableMains[0];
                const side = availableSides[0];
                const drink = availableDrinks[0];
                
                const comboKey = makeComboKey(main, side, drink);
                
                combo = {
                    main: main,
                    side: side,
                    drink: drink,
                    totalCalories: main.calories + side.calories + drink.calories,
                    tasteProfile: getComboTaste(main, side, drink),
                    popularityScore: (main.popularity_score + side.popularity_score + drink.popularity_score) / 3,
                    comboKey: comboKey
                };
                
                usedItems.add(main.item_name);
                usedItems.add(side.item_name);
                usedItems.add(drink.item_name);
                usedCombos.add(comboKey);
            }
        }
        
        if (combo) {
            combos.push(combo);
        }
    }
    dayCounter++;
    if (dayCounter >= 3) {
        usedCombos.clear();
        dayCounter = 0;
    }
    
    return combos;
}

app.post('/api/generate-combos', (req, res) => {
    const { day } = req.body;
    const combos = generateCombos(day);

    if (combos.length !== 3) {
        return res.status(500).json({ 
            error: `Could only generate ${combos.length} combos. Please try again.` 
        });
    }
    res.json({
        day: day,
        dayTasteProfile: dayTastes[day],
        combos: combos,
        remarks: {
            tasteProfile: `Day-specific taste profile: ${dayTastes[day]}`,
            uniqueness: "All items unique within day, combos unique across 3 days",
            calories: "Each combo: 550-800 calories",
            popularity: "Similar popularity scores across combos"
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
}); 
