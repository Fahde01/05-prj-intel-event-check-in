const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//Track attendance
let count = 0;
const MaxCount = 50; // Max capacity of the event

// HAndle form Submisiion
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value;
  const team = teamSelect.value;
  console.log("Name:", name, "Team:", team);

  count++;
  console.log("Current Count:", count);

  const percentage = Math.round((count / MaxCount) * 100) + "%";
  console.log("Percentage:", percentage);

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  const message = `Welcome ${name} from ${team}!`;

  form.reset();
});
