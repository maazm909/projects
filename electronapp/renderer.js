const ExcelJS  = require('exceljs');

document.getElementById('ticketNum').addEventListener("input", addTicket);

document.getElementById('submitbtn').addEventListener("click", processTickets);

document.getElementById('submitbtn').addEventListener("click", loadRanges);

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

//takes whatever is in ticket list and adds it to spreadsheet
async function processTickets() {
  var workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("data/testdata.xlsx");
  var worksheet = workbook.worksheets[0];
  worksheet.addRow([1, 'maaz', 'jeff']);
  await workbook.xlsx.writeFile('data/testdata.xlsx');
}
