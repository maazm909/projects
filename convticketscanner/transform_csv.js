const fs = require('fs');

// Read the source CSV file
const sourceData = fs.readFileSync('MMC25_Ticket_Sales_Log.xlsx - 2025.csv', 'utf8');
const lines = sourceData.split('\n');

// Skip header and process data lines
const processedData = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handling commas in quoted fields)
    const columns = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            columns.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    columns.push(current.trim());
    
    if (columns.length < 28) {
        continue;
    }
    
    const name = columns[1]; // Name column (index 1)
    const bookSerials = columns[27]; // Book Serials # column (index 27)
    
    // Skip if no name or no book serials
    if (!name || !bookSerials || bookSerials === '' || bookSerials.toLowerCase().includes('via') || bookSerials === '$0' || bookSerials === '$ -') {
        continue;
    }
    
    // Parse book serial ranges
    const ranges = parseBookSerials(bookSerials);
    
    if (ranges.length > 0) {
        const starts = ranges.map(r => r.start).join(',');
        const ends = ranges.map(r => r.end).join(',');
        
        processedData.push({
            fullName: name,
            starts: starts,
            ends: ends
        });
    }
}

function parseBookSerials(serialsText) {
    const ranges = [];
    
    // Clean up the text and split by common separators
    const parts = serialsText
        .replace(/[";,]/g, '|')
        .split('|')
        .map(p => p.trim())
        .filter(p => p.length > 0);
    
    for (const part of parts) {
        // Look for ranges like "100001-101000" or "100001 - 101000"
        const rangeMatch = part.match(/(\d{5,6})\s*-\s*(\d{5,6})/);
        if (rangeMatch) {
            const start = parseInt(rangeMatch[1]);
            const end = parseInt(rangeMatch[2]);
            if (start <= end) {
                ranges.push({ start, end });
            }
        }
    }
    
    return ranges;
}

// Create the output CSV
let outputCsv = 'Full Name,Ticket Range Starts,Ticket Range Ends\n';

for (const row of processedData) {
    outputCsv += `"${row.fullName}","${row.starts}","${row.ends}"\n`;
}

// Write the output file
fs.writeFileSync('transformed-tickets.csv', outputCsv);

console.log(`Processed ${processedData.length} entries with valid ticket ranges`);
console.log('Output saved to: transformed-tickets.csv');

// Show first few entries for verification
console.log('\nFirst 5 entries:');
processedData.slice(0, 5).forEach((row, i) => {
    console.log(`${i+1}. ${row.fullName}: ${row.starts} to ${row.ends}`);
});