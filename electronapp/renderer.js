document.getElementById('ticketNum').addEventListener("input", addTicket);

let currentTickets = [];

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

function processTickets() {

}
