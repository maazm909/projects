/* eslint-disable require-jsdoc */
const ExcelJS = require('exceljs');
const {dialog} = require('@electron/remote');

document.getElementById('ticketNum').addEventListener('input', addTicket);

document.getElementById('submitbtn')
    .addEventListener('click', determineSellers);

document.getElementById('ticket-form')
    .addEventListener('submit', (e) => e.preventDefault());

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
// radio button listeners for keys pressed
window.addEventListener('keypress', function(e) {
  if (e.key === 'a') {
    document.getElementById('$25').checked = true;
  } else if (e.key === 's') {
    document.getElementById('$20').checked = true;
  } else if (e.key === 'd') {
    document.getElementById('$other').checked = true;
    // TODO: handler function to manage opening option
  } else if (e.key === 'y') {
    document.getElementById('yespaid').checked = true;
  } else if (e.key === 'n') {
    document.getElementById('nopaid').checked = true;
  } else if (e.key in numbers) {
    document.getElementById('ticketNum').focus();
  } else if (e.key === 'Enter') {
    determineSellers();
  }
});

// add listeners to toggle otherprice box when other is selected
document.querySelectorAll('input[type=radio][name=priceselect]')
    .forEach((e) => e.addEventListener('change', toggleOtherPrice));

// listener to change value of radio button when other input box is changed
document.querySelector('#customprice')
    .addEventListener('input', updateOtherValue);

// only allow outfilebtn to be clicked if ranges file button has been clicked
document.getElementById('loadrangesbtn')
    .addEventListener('click', (e) => {
      document.getElementById('outputfilebtn').removeAttribute('disabled');
    });

// enable ticket num and submit button if output file button has been clicked
document.getElementById('outputfilebtn').addEventListener('click', (e) => {
  document.getElementById('ticketNum').removeAttribute('disabled');
  document.getElementById('submitbtn').removeAttribute('disabled');
});

document.getElementById('loadrangesbtn').addEventListener('click', function(e) {
  dialog.showOpenDialog({
    properties: ['openFile'],
  }).then((result) => {
    console.log(result.filePaths[0]);
    document.getElementById('rangespath').innerText = result.filePaths[0];
    rangesfile = result.filePaths[0];
  }).catch((err) => {
    console.log('failed range load');
  });
});

document.getElementById('outputfilebtn').addEventListener('click', function(e) {
  dialog.showOpenDialog({
    properties: ['openFile'],
  }).then((result) => {
    console.log(result.filePaths[0]);
    document.getElementById('outputpath').innerText = result.filePaths[0];
    outputfile = result.filePaths[0];
    loadRanges();
  }).catch((err) => {
    console.log('failed output file load');
  });
});

let currentTickets = [];

let ranges = {};

let rangesfile = '';

let outputfile = '';

// function to load ticket ranges of sellers
async function loadRanges() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(rangesfile);
  const sheet = workbook.worksheets[0];
  sheet.eachRow(function(row, rowNumber) {
    if (rowNumber != 1) { // need to skip first row, headers
      const fullname = row.values[1];
      const starts = row.values[2];
      const ends = row.values[3];
      let startspl = starts.split(',');
      let endsspl = ends.split(',');
      startspl = startspl.map((str) => {
        return Number(str);
      });
      endsspl = endsspl.map((str) => {
        return Number(str);
      });
      ranges = Object.assign(
          {[fullname]: {'starts': startspl, 'ends': endsspl}}, ranges);
    }
  });
  console.log(ranges);
}

// adds ticket to list and to visual table
function addTicket() {
  console.log('entered addticket');
  const numberbox = document.getElementById('ticketNum');
  const number = numberbox.value;
  if (number.toString().length == 6) {
    // append ticket to list
    currentTickets.push(number);
    // clear ticket number box
    numberbox.value = '';
    // add it visually to page
    updateVisualList();
    console.log(number);
  }
}

// handler function for removing ticket by clicking ticket cell
function removeTicket() {
  const number = this.innerText;
  currentTickets = currentTickets.filter((item) => item != number);
  updateVisualList();
}

// will update front end list with current ticket list
function updateVisualList() {
  // get table of tickets
  const table = document.querySelector('#ticketTable');
  // clear table
  table.innerHTML = '';
  const row = document.createElement('tr');
  console.log(currentTickets);
  for (const num of currentTickets) {
    // create tr
    // let row = document.createElement("tr");
    // create td
    const cell = document.createElement('td');
    cell.classList.add('ticketCells');
    cell.innerText = num;
    cell.addEventListener('click', removeTicket);
    row.appendChild(cell);
  }
  table.appendChild(row);
}

// references current ticket list
// determines seller of each one
// passes on to process ticket
async function determineSellers() {
  let numValid = false;
  // loop through each current ticket
  for (let j = 0; j < currentTickets.length; j++) {
    numValid = false;
    let num = currentTickets[j];
    // get name and ranges for each name
    for (const [key, val] of Object.entries(ranges)) {
      for (let i = 0; i < val.starts.length; i++) {
        // if number is in range, pass it on to process ticket
        num = Number(num);
        if (num >= val.starts[i] && num <= val.ends[i]) {
          numValid = true;
          await processTicket(key, num);
        }
      }
    }
    // if number does not match any seller
    // alert here that the number is invalid
    if (numValid == false) {
      createInvalidAlert(num);
    }
  }
  // clear current tickets since all were processed
  currentTickets = [];
  // update visually
  updateVisualList();
}

// takes ticket and name and add it and options to spreadsheet
async function processTicket(name, num) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputfile);
  let alreadywritten = false;
  // TODO: Create object to add to spreadsheet
  let info = {};
  const amount = document.querySelector(
      'input[type=radio][name=priceselect]:checked').value;
  const paidoption = document.querySelector(
      'input[type=radio][name=paidselect]:checked').value;
  info = {name: name, ticketnum: num, price: amount, alreadypaid: paidoption};
  // check if sheet for name exists
  let sheet = workbook.getWorksheet(name);
  // create new sheet if name not already in sheet
  if (sheet == null) {
    sheet = workbook.addWorksheet(name);
  }
  // sheet keys ARE NOT PERSISTED
  sheet.columns = [
    {header: 'Name', key: 'name', width: 30},
    {header: 'Ticket Number', key: 'ticketnum', width: 30},
    {header: 'Price', key: 'price', width: 30},
    {header: 'Already Paid', key: 'alreadypaid', width: 30},
  ];
  // check if ticket num is already in sheet
  sheet.eachRow(async function(row, rowNumber) {
    const location = 'B' + rowNumber.toString();
    const pulled = sheet.getCell(location);
    // if num is in sheet
    if (Number(pulled.text) == num) {
      // replace content
      sheet.spliceRows(rowNumber, 1, info);
      alreadywritten = true;
      await workbook.xlsx.writeFile(outputfile);
      // TODO: add replaced status message
    }
  });
  if (alreadywritten) {
    return;
  }
  // if ticket num not already in sheet, append row
  sheet.addRow(info);
  // var worksheet = workbook.worksheets[0];
  // worksheet.addRow([1, 'maaz', 'jeff']);
  await workbook.xlsx.writeFile(outputfile);
}

// hides or shows other price input box
function toggleOtherPrice() {
  const other = document.getElementById('$other');
  if (other.checked) {
    document.getElementById('customprice').style.display = 'inline-block';
  } else {
    document.getElementById('customprice').style.display = 'none';
  }
}

// update value of other radio button when other box is changed
function updateOtherValue() {
  const val = document.getElementById('customprice').value;
  document.getElementById('$other').value = val;
}

function createInvalidAlert(ticketNum) {
  const newAlert = document.createElement('div');
  const dateTime = new Date();
  newAlert.innerText =
    `Sorry, ${ticketNum} is not a valid ticket number | ${dateTime}`;
  newAlert.style['backgroundColor'] = 'yellow';
  newAlert.addEventListener('click', () => newAlert.remove());
  document.body.appendChild(newAlert);
}
