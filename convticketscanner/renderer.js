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

// Global barcode accumulator
let barcodeBuffer = '';
let barcodeTimeout;

createApp({
  data() {
    return {
      csvPath: '',
      csvData: [],
      sessionData: {},
      lastScanned: '',
      currentBarcode: '',
      scanStatus: '', // 'valid' or 'invalid'
      validatedPerson: '',
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
      try {
        const filePath = await ipcRenderer.invoke('select-csv');
        if (filePath) {
          this.csvPath = filePath;
          this.loadCSV(filePath);
          this.initializeSession();
          this.isScanning = true;
          this.statusMessage = 'CSV loaded successfully. Ready to scan tickets.';
          setTimeout(() => this.statusMessage = '', 3000);
        }
      } catch (error) {
        this.statusMessage = 'Error selecting file: ' + error.message;
      }
    },
    
    setupBarcodeListener() {
      const self = this;
      document.addEventListener('keydown', (e) => {
        if (!self.isScanning) return;
        
        // Handle Enter key - process barcode
        if (e.key === 'Enter' && barcodeBuffer) {
          self.processBarcode(barcodeBuffer);
          barcodeBuffer = '';
          self.currentBarcode = '';
          return;
        }
        
        // Handle backspace
        if (e.key === 'Backspace') {
          barcodeBuffer = barcodeBuffer.slice(0, -1);
          self.currentBarcode = barcodeBuffer;
          
          // Clear scan status if we're editing
          if (barcodeBuffer.length === 0) {
            self.lastScanned = '';
            self.scanStatus = '';
            self.validatedPerson = '';
          }
          return;
        }
        
        // Handle number keys (0-9) for barcode input
        if (e.key >= '0' && e.key <= '9') {
          // Clear previous scan when starting new input
          if (barcodeBuffer.length === 0) {
            self.lastScanned = '';
            self.scanStatus = '';
            self.validatedPerson = '';
          }
          
          barcodeBuffer += e.key;
          self.currentBarcode = barcodeBuffer;
          
          // Auto-process when reaching 6 digits
          if (barcodeBuffer.length === 6) {
            self.processBarcode(barcodeBuffer);
            barcodeBuffer = '';
            self.currentBarcode = '';
          }
        }
        
        // Handle payment shortcuts (only letters, no numbers)
        if (e.key === 'p' || e.key === 'P') {
          self.selectedPayment = 'prepaid';
        }
        if (e.key === 'd' || e.key === 'D') {
          self.selectedPayment = 'dayof';
        }
        
        // Save on Space (when barcode is processed and valid)
        if (e.key === ' ' && self.lastScanned && self.scanStatus === 'valid') {
          e.preventDefault();
          self.saveTicket();
        }
      });
    },
    
    processCurrentBarcode() {
      if (barcodeBuffer) {
        this.processBarcode(barcodeBuffer);
        barcodeBuffer = '';
        this.currentBarcode = '';
      }
    },
    
    processBarcode(barcode) {
      this.lastScanned = barcode;
      const person = this.validateBarcode(barcode);
      
      if (person) {
        this.scanStatus = 'valid';
        this.validatedPerson = person;
        this.statusMessage = `Valid ticket - Select payment and price, then save`;
      } else {
        this.scanStatus = 'invalid';
        this.validatedPerson = '';
        this.statusMessage = 'Invalid ticket number - not in any assigned range';
      }
    },
    
    saveTicket() {
      if (!this.lastScanned || this.scanStatus !== 'valid') return;
      
      const ticketData = {
        person: this.validatedPerson,
        timestamp: new Date().toISOString(),
        payment: this.selectedPayment,
        price: this.selectedPrice
      };
      
      // Update session data
      this.sessionData.scans[this.lastScanned] = ticketData;
      
      // Save session and update CSV
      this.saveSession();
      this.generateOutputCSV();
      
      this.statusMessage = `Saved: ${this.lastScanned} - ${this.selectedPayment} - $${this.selectedPrice}`;
      
      // Reset for next scan
      this.lastScanned = '';
      this.scanStatus = '';
      this.validatedPerson = '';
      
      // Clear status after 5 seconds
      setTimeout(() => this.statusMessage = '', 5000);
    },
    
    validateBarcode(barcode) {
      const barcodeNum = parseInt(barcode);
      if (isNaN(barcodeNum)) return null;
      
      for (const person of this.csvData) {
        const startsStr = person[CSV_COLUMNS.input.rangeStarts];
        const endsStr = person[CSV_COLUMNS.input.rangeEnds];
        
        if (!startsStr || !endsStr) continue;
        
        const starts = startsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const ends = endsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        
        for (let i = 0; i < Math.min(starts.length, ends.length); i++) {
          if (barcodeNum >= starts[i] && barcodeNum <= ends[i]) {
            return person[CSV_COLUMNS.input.name];
          }
        }
      }
      
      return null;
    },
    
    loadCSV(filePath) {
      try {
        const csvContent = fs.readFileSync(filePath, 'utf8');
        const parsed = Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true
        });
        
        this.csvData = parsed.data;
        console.log('CSV loaded:', this.csvData.length, 'records');
      } catch (error) {
        this.statusMessage = 'Error loading CSV: ' + error.message;
        console.error('CSV load error:', error);
      }
    },
    
    initializeSession() {
      this.sessionData = {
        csvPath: this.csvPath,
        lastModified: new Date().toISOString(),
        scans: {}
      };
      
      // Load existing scanned tickets from CSV if it exists
      this.loadExistingScannedTickets();
    },
    
    loadExistingScannedTickets() {
      try {
        const csvDir = path.dirname(this.csvPath);
        const outputPath = path.join(csvDir, 'scanned-tickets.csv');
        
        if (fs.existsSync(outputPath)) {
          const csvContent = fs.readFileSync(outputPath, 'utf8');
          const parsed = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true
          });
          
          // Convert existing CSV data back to session format
          parsed.data.forEach(row => {
            if (row.Barcode) {
              const paymentType = row['Payment Type'] === 'Prepaid' ? 'prepaid' : 'dayof';
              const price = parseInt(row.Price.replace('$', ''));
              
              this.sessionData.scans[row.Barcode] = {
                person: row['Associated Person'],
                timestamp: new Date().toISOString(), // We don't have original timestamp
                payment: paymentType,
                price: price
              };
            }
          });
          
          console.log('Loaded existing scanned tickets:', Object.keys(this.sessionData.scans).length);
        }
      } catch (error) {
        console.error('Error loading existing scanned tickets:', error);
      }
    },
    
    loadLastSession() {
      try {
        const sessionPath = this.getSessionPath();
        if (fs.existsSync(sessionPath)) {
          const sessionContent = fs.readFileSync(sessionPath, 'utf8');
          const session = JSON.parse(sessionContent);
          
          // Check if CSV file still exists
          if (session.csvPath && fs.existsSync(session.csvPath)) {
            this.csvPath = session.csvPath;
            this.loadCSV(this.csvPath);
            this.sessionData = session;
            
            // Load any existing scanned tickets from CSV to merge with session data
            this.loadExistingScannedTickets();
            
            this.isScanning = true;
            this.statusMessage = 'Previous session restored.';
            setTimeout(() => this.statusMessage = '', 3000);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    },
    
    saveSession() {
      try {
        this.sessionData.lastModified = new Date().toISOString();
        const sessionPath = this.getSessionPath();
        fs.writeFileSync(sessionPath, JSON.stringify(this.sessionData, null, 2));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    },
    
    getSessionPath() {
      if (!this.csvPath) return '';
      const csvDir = path.dirname(this.csvPath);
      const csvName = path.basename(this.csvPath, '.csv');
      return path.join(csvDir, `${csvName}-session.json`);
    },
    
    generateOutputCSV() {
      try {
        // Generate CSV rows - one row per scanned barcode
        const csvRows = [];
        const header = ['Barcode', 'Payment Type', 'Price', 'Associated Person'];
        csvRows.push(header);
        
        // Add each scanned barcode as a row (only valid barcodes are in sessionData.scans)
        Object.entries(this.sessionData.scans).forEach(([barcode, scan]) => {
          const paymentType = scan.payment === 'prepaid' ? 'Prepaid' : 'Day Of';
          csvRows.push([
            barcode,
            paymentType,
            `$${scan.price}`,
            scan.person
          ]);
        });
        
        // Convert to CSV string
        const csvContent = Papa.unparse(csvRows);
        
        // Use a fixed output filename in the same directory as the input CSV
        const csvDir = path.dirname(this.csvPath);
        const outputPath = path.join(csvDir, 'scanned-tickets.csv');
        
        fs.writeFileSync(outputPath, csvContent);
        console.log('Output CSV updated:', outputPath);
      } catch (error) {
        console.error('Error generating output CSV:', error);
      }
    }
  }
}).mount('#app');