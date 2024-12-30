document.addEventListener("DOMContentLoaded", () => {
  // Initialize sample data if localStorage is empty
  if (
    !localStorage.getItem("roomData") ||
    !localStorage.getItem("housekeepers")
  ) {
    const sampleRoomData = [
      {
        roomNumber: "101",
        area: "service",
        status: "Clean",
        housekeeper: "Alice",
        lostAndFound: "None",
        minibarStock: "Full",
        taskStatus: { cleaning: true, restocking: true, maintenance: false },
      },
      {
        roomNumber: "102",
        area: "pool",
        status: "Dirty",
        housekeeper: null,
        lostAndFound: "Sunglasses",
        minibarStock: "Low",
        taskStatus: { cleaning: false, restocking: true, maintenance: false },
      },
      {
        roomNumber: "103",
        area: "room",
        status: "Occupied",
        housekeeper: "Bob",
        lostAndFound: "None",
        minibarStock: "Partial",
        taskStatus: { cleaning: true, restocking: true, maintenance: true },
      },
      {
        roomNumber: "104",
        area: "service",
        status: "Clean",
        housekeeper: null,
        lostAndFound: "Wallet",
        minibarStock: "Full",
        taskStatus: { cleaning: true, restocking: false, maintenance: false },
      },
      {
        roomNumber: "105",
        area: "pool",
        status: "Occupied",
        housekeeper: "Charlie",
        lostAndFound: "None",
        minibarStock: "Low",
        taskStatus: { cleaning: false, restocking: false, maintenance: true },
      },
    ];

    const sampleHousekeepers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

    localStorage.setItem("roomData", JSON.stringify(sampleRoomData));
    localStorage.setItem("housekeepers", JSON.stringify(sampleHousekeepers));

    console.log("Sample data has been added to localStorage.");
  }

  // Fetch data from localStorage
  const roomData = JSON.parse(localStorage.getItem("roomData")) || [];
  const housekeepers = JSON.parse(localStorage.getItem("housekeepers")) || [];

  let currentRoomNumber = null;

  // Populate table for the active tab
  function populateTable(zone) {
    const tableId = {
      service: "#serviceZoneTable tbody",
      pool: "#poolZoneTable tbody",
      room: "#roomZoneTable tbody",
    }[zone];

    if (!tableId) return;

    const tableBody = document.querySelector(tableId);
    tableBody.innerHTML = ""; // Clear table

    const filteredRooms = roomData.filter((room) => room.area === zone);

    filteredRooms.forEach((room) => {
      const taskCompleted = room.taskStatus
        ? Object.values(room.taskStatus).filter((status) => status).length
        : 0;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="#" class="room-link" data-room="${room.roomNumber}">${
        room.roomNumber
      }</a></td>
        <td>${room.status || "N/A"}</td>
        <td>
          ${
            room.housekeeper
              ? room.housekeeper
              : `<button class="btn btn-assign btn-sm" data-room="${room.roomNumber}">Assign</button>`
          }
        </td>
        <td>${room.lostAndFound || "-"}</td>
        <td>${room.minibarStock || "-"}</td>
        <td>${taskCompleted} / 9 tasks completed</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Forcefully trigger the tab content for the active tab
  function initializeDefaultTab() {
    const defaultZone = getActiveZone();
    populateTable(defaultZone);
  }

  function showAssignModal(roomNumber) {
    currentRoomNumber = roomNumber; // Set the room being assigned
    const modalBody = document.querySelector(
      "#assignHousekeeperModal .modal-body"
    );

    if (housekeepers.length === 0) {
      modalBody.innerHTML = "<p>No housekeepers available.</p>";
    } else {
      modalBody.innerHTML = housekeepers
        .map(
          (housekeeper) => `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="housekeeper" value="${housekeeper}">
            <label class="form-check-label">${housekeeper}</label>
          </div>`
        )
        .join("");
    }

    const modal = new bootstrap.Modal(
      document.getElementById("assignHousekeeperModal")
    );
    modal.show();
  }

  // Complete assignment
  function completeAssignment() {
    const selectedHousekeeper = document.querySelector(
      'input[name="housekeeper"]:checked'
    );
    if (!selectedHousekeeper) {
      alert("Please select a housekeeper!");
      return;
    }

    const roomIndex = roomData.findIndex(
      (room) => room.roomNumber === currentRoomNumber
    );
    if (roomIndex !== -1) {
      roomData[roomIndex].housekeeper = selectedHousekeeper.value; // Assign housekeeper
      localStorage.setItem("roomData", JSON.stringify(roomData)); // Save to localStorage
      populateTable(getActiveZone()); // Refresh the table

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("assignHousekeeperModal")
      );
      modal.hide(); // Close modal
    }
  }

  // Get active tab zone
  function getActiveZone() {
    const activeTab = document.querySelector(".nav-tabs .nav-link.active");
    return activeTab ? activeTab.id.split("-")[0] : "service";
  }

  // Event listener for tab switching
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.addEventListener("shown.bs.tab", (e) => {
      const zone = e.target.id.split("-")[0];
      populateTable(zone);
    });
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-assign")) {
      const roomNumber = e.target.getAttribute("data-room");
      showAssignModal(roomNumber);
    }
  });

  // Assign modal complete button
  document
    .querySelector(".complete-assignment-btn")
    .addEventListener("click", completeAssignment);

  // Room link click handler
  document.body.addEventListener("click", (e) => {
    const roomLink = e.target.closest(".room-link");
    if (roomLink) {
      const roomNumber = roomLink.getAttribute("data-room");
      if (roomNumber) {
        // Navigate to roomdetail.html with the room number as a query parameter
        window.location.href = `roomdetail.html?room=${encodeURIComponent(
          roomNumber
        )}`;
      }
    }
  });

  // Populate the default tab's table on page load
  populateTable(getActiveZone());

  // Initialize the default tab's table on page load
  initializeDefaultTab();
});
