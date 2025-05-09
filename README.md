# BetterBrowse

A Chrome extension that helps you track and reduce your digital carbon footprint.

## Features

- **Energy Usage Tracking**: Monitor estimated energy consumption from your browsing habits
- **CO₂ Equivalent Visualization**: Understand your digital footprint in tangible CO₂ terms
- **Actionable Eco-tips**: Receive contextual suggestions to reduce your digital environmental impact
- **Progress Tracking**: View your CO₂ savings over time and maintain eco-friendly streaks

## Development

### Prerequisites

- Node.js and npm

### Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the extension:
   ```
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder from this project

## Current Implementation

This version uses mocked data to simulate tracking of:
- Open tabs count
- Browser idle time
- Energy usage calculations
- CO₂ equivalent emissions

In a real-world implementation, these values would be calculated based on actual browser usage patterns and up-to-date energy consumption models for digital services.
