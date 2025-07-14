# Ticket Scanner Desktop App - Complete Build Specification

## Project Overview
Create a Windows desktop application using Electron and Vue 3 that scans ticket barcodes via USB scanner (keyboard input), validates them against assigned ranges from a CSV file, tracks payment information, and continuously updates an output CSV file.

## Technology Stack
- **Electron** (latest stable version ~28.0.0)
- **Vue 3** (via CDN in index.html)
- **Papa Parse** for CSV parsing
- **Node.js fs** for file operations
- **No build tools needed** - pure HTML/JS/CSS

## Project Structure
```
ticket-scanner/
├── package.json
├── main.js
├── index.html
├── renderer.js
├── styles.css
└── icon.ico (optional)
```

## File Specifications

### 1. package.json
```json
{
  "name": "ticket-scanner",
  "version": "1.0.0",
  "description": "Ticket Scanner App",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "dev": "electron . --dev"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  },
  "dependencies": {
    "papaparse": "^5.4.1"
  },
  "build": {
    "appId": "com.ticketscanner.app",
    "productName": "Ticket Scanner",
    "directories": {
      "output": "dist"
    },
    "win": {
      "target": "nsis",
      "icon": "icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### 2. main.js (Electron Main Process)
```javascript
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    resizable: false
  });

  mainWindow.loadFile('index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// File dialog handler
ipcMain.handle('select-csv', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  });
  return result.filePaths[0];
});
```

### 3. index.html
Create a clean, minimal interface with:
- Vue 3 CDN import
- Papa Parse CDN import
- Minimal UI showing:
  - File selector button
  - Last scanned barcode display
  - Payment type buttons (Prepaid/Paid Day Of)
  - Price buttons ($10/$15/$20)
  - Status messages

Key elements:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ticket Scanner</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/papaparse@5/papaparse.min.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <!-- File selection if no file loaded -->
    <!-- Scanning interface when file is loaded -->
    <!-- Show last scanned barcode -->
    <!-- Payment and price selection buttons -->
  </div>
  <script src="renderer.js"></script>
</body>
</html>
```

### 4. renderer.js (Main Application Logic)
This is the core file. Structure it with:

```javascript
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// CONFIGURATION - Easy to change column names
const CSV_COLUMNS = {
  input: {
    name: 'Full Name',
    rangeStarts: 'Ticket Range Starts',
    rangeEnds: 'Ticket Range Ends'
  },
  output: {
    name: 'Full Name',
    totalCount: 'Total Count',
    prepaidCount: 'Prepaid Count',
    paidDayOfCount: 'Paid Day Of Count',
    count10: '$10 Count',
    count15: '$15 Count',
    count20: '$20 Count'
  }
};

const { createApp } = Vue;

createApp({
  data() {
    return {
      csvPath: '',
      csvData: [],
      sessionData: {},
      lastScanned: '',
      scanStatus: '', // 'valid' or 'invalid'
      selectedPayment: 'dayof', // 'prepaid' or 'dayof'
      selectedPrice: 20, // 10, 15, or 20
      statusMessage: '',
      isScanning: false
    }
  },
  
  mounted() {
    this.setupBarcodeListener();
    this.loadLastSession();
  },
  
  methods: {
    async selectCSV() {
      // Use ipcRenderer to open file dialog
      // Load and parse CSV
      // Initialize session data structure
    },
    
    setupBarcodeListener() {
      // Global keyboard listener for barcode input
      // Accumulate digits until Enter key
      // Process barcode when complete
    },
    
    processBarcode(barcode) {
      // Validate against ranges
      // Update UI with status
      // Auto-save with defaults or wait for user selection
    },
    
    saveTicket() {
      // Update session data
      // Save to JSON file
      // Update output CSV
      // Reset for next scan
    },
    
    validateBarcode(barcode) {
      // Check if barcode falls within any person's ranges
      // Return person name if valid, null if not
    },
    
    loadCSV(filePath) {
      // Parse CSV with Papa Parse
      // Build data structure for quick lookups
    },
    
    saveSession() {
      // Save current session to JSON
      // Update output CSV with timestamp
    },
    
    generateOutputCSV() {
      // Create CSV with counts per person
      // Include all count columns
    }
  }
}).mount('#app');
```

### 5. styles.css
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
  user-select: none;
}

.container {
  max-width: 560px;
  margin: 0 auto;
}

.scan-display {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.scan-display.valid { color: #22c55e; }
.scan-display.invalid { color: #ef4444; }

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

button {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

button.selected {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

button:hover {
  border-color: #3b82f6;
}

.status-message {
  text-align: center;
  padding: 10px;
  color: #666;
}
```

## Key Implementation Details

### Barcode Scanning Logic
```javascript
// Global barcode accumulator
let barcodeBuffer = '';
let barcodeTimeout;

document.addEventListener('keydown', (e) => {
  if (!this.isScanning) return;
  
  // Clear previous timeout
  clearTimeout(barcodeTimeout);
  
  // Handle Enter key
  if (e.key === 'Enter' && barcodeBuffer) {
    this.processBarcode(barcodeBuffer);
    barcodeBuffer = '';
    return;
  }
  
  // Handle number keys
  if (e.key >= '0' && e.key <= '9') {
    barcodeBuffer += e.key;
    
    // Auto-submit after 100ms of no input
    barcodeTimeout = setTimeout(() => {
      if (barcodeBuffer) {
        this.processBarcode(barcodeBuffer);
        barcodeBuffer = '';
      }
    }, 100);
  }
  
  // Handle payment shortcuts
  if (e.key === 'p' || e.key === 'P' || e.key === '1') {
    this.selectedPayment = 'prepaid';
  }
  if (e.key === 'd' || e.key === 'D' || e.key === '2') {
    this.selectedPayment = 'dayof';
  }
  
  // Handle price shortcuts
  if (e.key === '4') this.selectedPrice = 10;
  if (e.key === '5') this.selectedPrice = 15;
  if (e.key === '6') this.selectedPrice = 20;
  
  // Save on Space or Enter (when not inputting barcode)
  if ((e.key === ' ' || e.key === 'Enter') && !barcodeBuffer && this.lastScanned) {
    this.saveTicket();
  }
});
```

### Range Validation Logic
```javascript
validateBarcode(barcode) {
  const barcodeNum = parseInt(barcode);
  
  for (const person of this.csvData) {
    const starts = person[CSV_COLUMNS.input.rangeStarts].split(',').map(s => parseInt(s.trim()));
    const ends = person[CSV_COLUMNS.input.rangeEnds].split(',').map(s => parseInt(s.trim()));
    
    for (let i = 0; i < starts.length; i++) {
      if (barcodeNum >= starts[i] && barcodeNum <= ends[i]) {
        return person[CSV_COLUMNS.input.name];
      }
    }
  }
  
  return null;
}
```

### Session Data Structure
```javascript
{
  "csvPath": "/path/to/input.csv",
  "lastModified": "2024-01-15T10:30:00.000Z",
  "scans": {
    "12345": {
      "person": "John Doe",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "payment": "prepaid",
      "price": 20
    }
  }
}
```

### Auto-save Implementation
- After each scan, immediately update both JSON and CSV
- Use synchronous file writes for reliability
- Output filename format: `scanned-tickets-YYYY-MM-DD-HH-mm-ss.csv`

## Building and Distribution

### Development:
```bash
npm install
npm run dev
```

### Build for Windows:
```bash
npm run build
```

This creates an installer in the `dist` folder.

## Testing Checklist
1. CSV file selection works
2. Barcode scanning captures numbers correctly
3. Range validation works with multiple ranges per person
4. Payment and price selection via buttons and keyboard
5. Auto-save after each scan
6. Session persistence across app restarts
7. Output CSV has correct format and counts
8. Invalid barcodes show error and don't save
9. Rescanning replaces previous entry
10. Keyboard shortcuts work as expected

## Important Notes
- The app should feel instant and responsive
- No loading states needed - everything is local
- Focus returns to scanning after each action
- Minimal UI for maximum speed
- All file operations in the same directory as input CSV
- Column names easily configurable at top of renderer.js