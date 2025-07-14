# Ticket Scanner Desktop App

A Windows desktop application built with Electron and Vue 3 that scans ticket barcodes via USB scanner, validates them against assigned ranges from a CSV file, and tracks payment information.

## Features

- **Barcode Scanning**: Supports USB barcode scanners (keyboard input mode)
- **Range Validation**: Validates tickets against predefined ranges from CSV
- **Payment Tracking**: Tracks payment type (Prepaid/Day Of) and prices ($10/$15/$20)
- **Auto-save**: Automatically saves scan data and generates output CSV
- **Session Persistence**: Remembers previous session on app restart
- **Keyboard Shortcuts**: Fast operation with number key shortcuts

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for Windows:
```bash
npm run build
```

## Usage

### CSV Format
Your input CSV file must have these columns:
- `Full Name`: Person's name
- `Ticket Range Starts`: Comma-separated starting numbers (e.g., "1001,1501")
- `Ticket Range Ends`: Comma-separated ending numbers (e.g., "1100,1600")

### Scanning Process
1. Select your CSV file
2. Scan 6-digit barcodes (auto-submits) or type ticket numbers + Enter
3. Select payment type and price using buttons or keyboard shortcuts
4. Press Space to save

### Keyboard Shortcuts
- **P**: Select Prepaid payment
- **D**: Select Day Of payment
- **Space**: Save current ticket
- **Numbers 0-9**: Input barcode digits (auto-submits at 6 digits)

### Output
- Session data is saved as `[filename]-session.json`
- Scan results are exported as `scanned-tickets-[timestamp].csv`
- Output includes counts per person for all payment types and prices

## File Structure
```
ticket-scanner/
├── package.json          # Dependencies and build config
├── main.js               # Electron main process
├── index.html            # UI interface
├── renderer.js           # Application logic
├── styles.css            # Styling
├── sample-tickets.csv    # Sample input file
└── README.md             # This file
```

## Testing with Sample Data

Use the included `sample-tickets.csv` file to test the application:
- John Doe: tickets 100001-100050
- Jane Smith: tickets 100051-100100
- Bob Johnson: tickets 100101-100150
- Alice Brown: tickets 100151-100200
- Charlie Davis: tickets 100201-100250

Try scanning ticket numbers like 100025, 100075, 100125, etc.

## Building for Distribution

The app builds to a Windows installer in the `dist` folder:
```bash
npm run build
```

The installer allows users to choose installation directory and creates desktop shortcuts.