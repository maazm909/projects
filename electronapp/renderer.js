const ExcelJS  = require('exceljs');

document.getElementById('ticketNum').addEventListener("input", addTicket);

document.getElementById('submitbtn').addEventListener("click", determineSellers);

// document.getElementById('submitbtn').addEventListener("click", loadRanges);

window.addEventListener("load", loadRanges);

let currentTickets = [];

let ranges = {};

//function to load ticket ranges of sellers
async function loadRanges() {
  var workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("data/ranges.xlsx");
  const sheet = workbook.worksheets[0];
  sheet.eachRow(function(row, rowNumber) {
    if (rowNumber != 1) { //need to skip first row, headers
      let fullname = row.values[1];
      let starts = row.values[2];
      let ends = row.values[3];
      let startspl = starts.split(",");
      let endsspl = ends.split(",");
      startspl = startspl.map(str => {
        return Number(str);
      });
      endsspl = endsspl.map(str => {
        return Number(str);
      });
      ranges = Object.assign({[fullname]:{'starts':startspl, 'ends':endsspl}}, ranges);
    }
  });
  console.log(ranges);
}

//adds ticket to list and to visual table
function addTicket() {
  console.log("entered addticket");
  let number = document.getElementById('ticketNum').value;
  if (number.toString().length == 6) {
    //append ticket to list
    currentTickets.push(number);
    //add it visually to page
    updateVisualList();
    console.log(number);
  }
}

//handler function for removing ticket by clicking ticket cell
function removeTicket() {
  let number = this.innerText;
  currentTickets = currentTickets.filter(item => item != number);
  updateVisualList();
}

// will update front end list with current ticket list
function updateVisualList() {
  //get table of tickets
  let table = document.querySelector("#ticketTable");
  //clear table
  table.innerHTML = "";
  console.log(currentTickets);
  for (const num of currentTickets) {
    //create tr 
    let row = document.createElement("tr");
    //create td
    let cell = document.createElement("td");
    cell.innerText = num;
    cell.addEventListener("click", removeTicket);
    row.appendChild(cell);
    table.appendChild(row);
  }
}

//looks at current ticket list and determines seller of each one, then passes on to process ticket
async function determineSellers() {
  //loop through each current ticket
  currentTickets.forEach(num => {
    //get name and ranges for each name
    for (let [key, val] of Object.entries(ranges)) {
      for (var i = 0; i < val.starts.length; i++) {
        //if number is in range, pass it on to process ticket
        num = Number(num);
        if (num > val.starts[i] && num < val.ends[i]) {
          processTicket(key, num);
        }
      }
    }  
  });  
}

//takes ticket and name and add it and options to spreadsheet
async function processTicket(name, num) {
  var workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("data/output.xlsx");
  //TODO: Create object to add to spreadsheet
  var info = {};
  info = {name: name, ticketnum: num, price: 10, alreadypaid: 'yes'}
  //check if sheet for name exists 
  var sheet = workbook.getWorksheet(name);
  //create new sheet if name not already in sheet
  if (sheet == null) { 
    sheet = workbook.addWorksheet(name);
    sheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Ticket Number', key: 'ticketnum', width: 30 },
      { header: 'Price', key: 'price', width: 30 },
      { header: 'Already Paid', key: 'alreadypaid', width: 30}
    ];
  }
  sheet.addRow(info);
  // var worksheet = workbook.worksheets[0];
  // worksheet.addRow([1, 'maaz', 'jeff']);
  await workbook.xlsx.writeFile('data/output.xlsx');
}
