# Shamir's Secret Sharing Solution

## Overview
This project implements Shamir's Secret Sharing algorithm to find the constant term of an unknown polynomial using Lagrange interpolation.

## Problem
- Given polynomial: f(x) = a_m x^m + a_{m-1} x^{m-1} + ... + a_1 x + c
- Goal: Find the constant term 'c' (the secret)
- Input: JSON with encoded shares in different bases
- Method: Lagrange interpolation

## Solution
1. **Base Conversion**: Decode values from various bases (binary, octal, hex, etc.)
2. **Lagrange Interpolation**: Reconstruct polynomial from decoded points
3. **Secret Extraction**: Calculate f(0) to get constant term 'c'

## Files
- `index.html` - Complete solution with web interface
- `README.md` - This file

## How to Use
1. **Live Demo**: [Add your GitHub Pages URL here]
2. **Local**: Open `index.html` in any web browser
3. Click "SOLVE BOTH TEST CASES" button
4. View results on screen and in browser console

## Output
The solution provides secrets for both test cases:
- Test Case 1: 4 shares, polynomial degree 2
- Test Case 2: 10 shares, polynomial degree 6

## Technical Details
- **Language**: JavaScript (No Python as per requirements)
- **Libraries**: None (Pure JavaScript with BigInt for large numbers)
- **Algorithm**: Lagrange Basis Polynomial Interpolation
- **UI**: Simple HTML/CSS interface

## Test Cases
### Test Case 1
```json
{
    "keys": {"n": 4, "k": 3},
    "1": {"base": "10", "value": "4"},
    "2": {"base": "2", "value": "111"},
    "3": {"base": "10", "value": "12"},
    "6": {"base": "4", "value": "213"}
}
```

### Test Case 2
```json
{
    "keys": {"n": 10, "k": 7},
    "1": {"base": "6", "value": "13444211440455345511"},
    "2": {"base": "15", "value": "aed7015a346d63"},
    "3": {"base": "15", "value": "6aeeb69631c227c"},
    "4": {"base": "16", "value": "e1b5e05623d881f"},
    "5": {"base": "8", "value": "316034514573652620673"},
    "6": {"base": "3", "value": "2122212201122002221120200210011020220200"},
    "7": {"base": "3", "value": "20120221122211000100210021102001201112121"},
    "8": {"base": "6", "value": "20220554335330240002224253"},
    "9": {"base": "12", "value": "45153788322a1255483"},
    "10": {"base": "7", "value": "1101613130313526312514143"}
}
```

## Assignment Requirements Met
✅ Read JSON input from test cases  
✅ Decode Y values from different bases  
✅ Find secret using mathematical interpolation  
✅ No external libraries used  
✅ Handle 256-bit numbers  
✅ Pure JavaScript implementation  

## Author
Created for Catalog Placements Assignment
