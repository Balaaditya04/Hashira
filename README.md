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
Large dataset with 10 shares using bases 3, 6, 7, 8, 12, 15, 16.

## Assignment Requirements Met
✅ Read JSON input from test cases  
✅ Decode Y values from different bases  
✅ Find secret using mathematical interpolation  
✅ No external libraries used  
✅ Handle 256-bit numbers  
✅ Pure JavaScript implementation  

## Author
Created for Catalog Placements Assignment
