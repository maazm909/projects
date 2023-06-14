const ExcelJS  = require('exceljs');
const { dialog } = require('@electron/remote');

document.getElementById('ticketNum').addEventListener("input", addTicket);

document.getElementById('submitbtn').addEventListener("click", determineSellers);

// document.getElementById('submitbtn').addEventListener("click", loadRanges);

// window.addEventListener("load", loadRanges);

//radio button listeners for keys pressed
window.addEventListener("keypress", function(e) {
  if (e.key === "a") {
    document.getElementById('$25').checked = true;
  }
  else if (e.key === "s") {
    document.getElementById('$20').checked = true;
  }
  else if (e.key === "d") {
    document.getElementById('$other').checked = true;
    //TODO: handler function to manage opening option
  }
  else if (e.key === "y") {
    document.getElementById('yespaid').checked = true;
  }
  else if (e.key === "n") {
    document.getElementById('nopaid').checked = true;
  }
});

//add listeners to toggle otherprice box when other is selected
document.querySelectorAll('input[type=radio][name=priceselect]').forEach(e => e.addEventListener('change', toggleOtherPrice));

//add listener to change value of other radio button when other input box is changed
document.querySelector('#customprice').addEventListener('input', updateOtherValue);

document.getElementById("loadrangesbtn").addEventListener('click', function(e) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then(result => {
    console.log(result.filePaths[0]);
    document.getElementById("rangespath").innerText = result.filePaths[0];
    rangesfile = result.filePaths[0];
  }).catch(err => {
    console.log("failed range load");
  });
      
});

document.getElementById("outputfilebtn").addEventListener('click', function(e) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then(result => {
    console.log(result.filePaths[0]);
    document.getElementById("outputpath").innerText = result.filePaths[0];
    outputfile = result.filePaths[0];
    loadRanges();
  }).catch(err => {
    console.log("failed output file load");
  });
});

let currentTickets = [];

let ranges = {};

let rangesfile = "";

let outputfile = "";

//function to load ticket ranges of sellers
async function loadRanges() {
  var workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(rangesfile);
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
  let numberbox = document.getElementById('ticketNum');
  let number = numberbox.value;
  if (number.toString().length == 6) {
    //append ticket to list
    currentTickets.push(number);
    //clear ticket number box
    numberbox.value = '';
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
  let row = document.createElement("tr");
  console.log(currentTickets);
  for (const num of currentTickets) {
    //create tr 
    // let row = document.createElement("tr");
    //create td
    let cell = document.createElement("td");
    cell.classList.add("ticketCells");
    cell.innerText = num;
    cell.addEventListener("click", removeTicket);
    row.appendChild(cell);
  }
  table.appendChild(row);
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
  //clear current tickets since all were processed
  currentTickets = [];
  //update visually
  updateVisualList();
}

//takes ticket and name and add it and options to spreadsheet
async function processTicket(name, num) {
  var workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputfile);
  let alreadywritten = false;
  //TODO: Create object to add to spreadsheet
  var info = {};
  let amount = document.querySelector('input[type=radio][name=priceselect]:checked').value;
  let paidoption = document.querySelector('input[type=radio][name=paidselect]:checked').value;
  info = {name: name, ticketnum: num, price: amount, alreadypaid: paidoption};
  //check if sheet for name exists 
  var sheet = workbook.getWorksheet(name);
  //create new sheet if name not already in sheet
  if (sheet == null) { 
    sheet = workbook.addWorksheet(name);
  }
  //sheet keys ARE NOT PERSISTED
  sheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Ticket Number', key: 'ticketnum', width: 30 },
    { header: 'Price', key: 'price', width: 30 },
    { header: 'Already Paid', key: 'alreadypaid', width: 30}
  ];
  //check if ticket num is already in sheet
  sheet.eachRow(async function(row, rowNumber) {
    let location = "B" + rowNumber.toString();
    let pulled = sheet.getCell(location);
    //if num is in sheet
    if (Number(pulled.text) == num) {
      //replace content
      sheet.spliceRows(rowNumber, 1, info);
      alreadywritten = true;
      await workbook.xlsx.writeFile(outputfile);
      //TODO: add replaced status message
    }
  });
  if (alreadywritten) {
    return;
  }
  //if ticket num not already in sheet, append row
  sheet.addRow(info);
  // var worksheet = workbook.worksheets[0];
  // worksheet.addRow([1, 'maaz', 'jeff']);
  await workbook.xlsx.writeFile(outputfile);
}

//hides or shows other price input box
function toggleOtherPrice() {
  let other = document.getElementById('$other');
  if (other.checked) {
    document.getElementById('customprice').style.display = 'inline-block';
  }
  else {
    document.getElementById('customprice').style.display = 'none';
  }

}

//update value of other radio button when other box is changed
function updateOtherValue() {
  let val = document.getElementById('customprice').value;
  document.getElementById('$other').value = val;
}