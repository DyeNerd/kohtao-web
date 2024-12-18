document.addEventListener("DOMContentLoaded", () => {
  const roomData = JSON.parse(localStorage.getItem("roomData")) || [];
  const housekeepers = JSON.parse(localStorage.getItem("housekeepers")) || [];

  let currentRoomNumber = null; // To track the room being assigned

  // Populate table with room data
  function populateTable() {
    const tableBody = document.querySelector("#housekeepingTable tbody");
    tableBody.innerHTML = ""; // Clear table

    roomData.forEach((room) => {
      const taskCompleted = room.taskStatus
        ? Object.values(room.taskStatus).filter((status) => status).length
        : 0;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="roomdetail.html" class="room-link" data-room="${
          room.roomNumber
        }">${room.roomNumber}</a></td>
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

  // Open housekeeper assignment modal
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

  // Complete housekeeper assignment
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
      roomData[roomIndex].housekeeper = selectedHousekeeper.value; // Update the housekeeper
      localStorage.setItem("roomData", JSON.stringify(roomData)); // Save to localStorage
      populateTable(); // Refresh the table

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("assignHousekeeperModal")
      );
      modal.hide(); // Close the modal
    }
  }

  document
    .querySelector("#housekeepingTable")
    .addEventListener("click", (e) => {
      // Navigate to room detail page
      if (e.target.classList.contains("room-link")) {
        const roomNumber = e.target.getAttribute("data-room");
        localStorage.setItem("selectedRoom", roomNumber);
      }

      // Open assign modal
      if (e.target.classList.contains("btn-assign")) {
        const roomNumber = e.target.getAttribute("data-room");
        showAssignModal(roomNumber);
      }
    });

  document
    .querySelector(".complete-assignment-btn")
    .addEventListener("click", completeAssignment);

  // Initialize table
  populateTable();
});
