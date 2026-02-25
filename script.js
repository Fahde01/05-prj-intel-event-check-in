const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const progressBar = document.getElementById("progressBar");
const attendeeCount = document.getElementById("attendeeCount");
const greeting = document.getElementById("greeting");
const attendeeList = document.getElementById("attendeeList");

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const STORAGE_KEYS = {
  totalCount: "intelEventTotalCount",
  waterCount: "intelEventWaterCount",
  zeroCount: "intelEventZeroCount",
  powerCount: "intelEventPowerCount",
  attendees: "intelEventAttendees",
};

//Track attendance
let count = 0;
const MaxCount = 50; // Max capacity of the event
let attendees = [];

function getStoredNumber(key) {
  const savedValue = localStorage.getItem(key);
  if (savedValue === null) {
    return 0;
  }

  const numberValue = parseInt(savedValue, 10);
  if (isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

function saveCounts() {
  localStorage.setItem(STORAGE_KEYS.totalCount, count);
  localStorage.setItem(
    STORAGE_KEYS.waterCount,
    document.getElementById("waterCount").textContent,
  );
  localStorage.setItem(
    STORAGE_KEYS.zeroCount,
    document.getElementById("zeroCount").textContent,
  );
  localStorage.setItem(
    STORAGE_KEYS.powerCount,
    document.getElementById("powerCount").textContent,
  );
}

function saveAttendees() {
  localStorage.setItem(STORAGE_KEYS.attendees, JSON.stringify(attendees));
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "attendee-empty";
    emptyItem.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  for (let i = attendees.length - 1; i >= 0; i--) {
    const attendee = attendees[i];

    const listItem = document.createElement("li");
    listItem.className = "attendee-list-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "attendee-name";
    nameSpan.textContent = attendee.name;

    const teamSpan = document.createElement("span");
    teamSpan.className = "attendee-team";
    teamSpan.textContent = attendee.team;

    listItem.appendChild(nameSpan);
    listItem.appendChild(teamSpan);
    attendeeList.appendChild(listItem);
  }
}

function loadAttendees() {
  const savedAttendees = localStorage.getItem(STORAGE_KEYS.attendees);
  if (savedAttendees === null) {
    attendees = [];
    renderAttendeeList();
    return;
  }

  const parsedAttendees = JSON.parse(savedAttendees);
  if (Array.isArray(parsedAttendees)) {
    attendees = parsedAttendees;
  } else {
    attendees = [];
  }

  renderAttendeeList();
}

function loadCounts() {
  count = getStoredNumber(STORAGE_KEYS.totalCount);
  attendeeCount.textContent = count;

  document.getElementById("waterCount").textContent = getStoredNumber(
    STORAGE_KEYS.waterCount,
  );
  document.getElementById("zeroCount").textContent = getStoredNumber(
    STORAGE_KEYS.zeroCount,
  );
  document.getElementById("powerCount").textContent = getStoredNumber(
    STORAGE_KEYS.powerCount,
  );

  const percentage = Math.round((count / MaxCount) * 100);
  progressBar.style.width = percentage + "%";

  if (count >= MaxCount) {
    const winningTeamName = getWinningTeamName();
    greeting.innerHTML = `🎉 Goal reached! <strong>${winningTeamName}</strong> wins the check-in challenge!`;
  }
}

loadCounts();
loadAttendees();

function getWinningTeamName() {
  let winningTeamKey = "water";
  let highestCount = parseInt(
    document.getElementById("waterCount").textContent,
    10,
  );

  const zeroCount = parseInt(
    document.getElementById("zeroCount").textContent,
    10,
  );
  if (zeroCount > highestCount) {
    highestCount = zeroCount;
    winningTeamKey = "zero";
  }

  const powerCount = parseInt(
    document.getElementById("powerCount").textContent,
    10,
  );
  if (powerCount > highestCount) {
    winningTeamKey = "power";
  }

  return teamNames[winningTeamKey];
}

// HAndle form Submisiion
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value;
  const team = teamSelect.value;
  const selectedTeamLabel = teamSelect.options[teamSelect.selectedIndex].text;
  console.log("Name:", name, "Team:", team);

  count++;
  console.log("Current Count:", count);
  attendeeCount.textContent = count;

  const percentage = Math.round((count / MaxCount) * 100);
  progressBar.style.width = percentage + "%";

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  const message = `Welcome ${name} from ${selectedTeamLabel}!`;
  alert(message);

  attendees.push({ name: name, team: selectedTeamLabel });
  renderAttendeeList();
  saveAttendees();

  if (count >= MaxCount) {
    const winningTeamName = getWinningTeamName();
    greeting.innerHTML = `🎉 Goal reached! <strong>${winningTeamName}</strong> wins the check-in challenge!`;
  }

  saveCounts();

  form.reset();
});
