document.addEventListener("DOMContentLoaded", () => {
  // Set default date to today
  const dateInput = document.getElementById("scheduleDate");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  // Sample schedule data
  if (!localStorage.getItem("schedule")) {
    const sampleSchedule = [
      {
        housekeeper: "Somjai L. (Jai)",
        task: "Beach cleaning",
        start: 6,
        end: 8,
        date: today,
        area: "service",
      },
      {
        housekeeper: "Somjai L. (Jai)",
        task: "Make up - 001",
        start: 8,
        end: 9.5,
        date: today,
        area: "service",
      },
      {
        housekeeper: "Saiyai L. (Sai)",
        task: "Check out - 004",
        start: 10,
        end: 12,
        date: today,
        area: "room",
      },
      {
        housekeeper: "Somjai L. (Jai)",
        task: "Pool cleaning",
        start: 6,
        end: 8,
        date: today,
        area: "pool",
      },
    ];
    localStorage.setItem("schedule", JSON.stringify(sampleSchedule));
  }

  const scheduleData = JSON.parse(localStorage.getItem("schedule"));

  // Create the header dynamically
  function createHeader(headerId) {
    const headerRow = document.getElementById(headerId);
    for (let i = 6; i <= 20; i += 0.5) {
      const hour = Math.floor(i);
      const minutes = i % 1 === 0 ? "00" : "30";
      const column = document.createElement("th");
      column.style.minWidth = "80px"; // Fixed width for columns
      column.textContent = `${hour}:${minutes}`;
      headerRow.appendChild(column);
    }
  }

  // Populate table for a specific area
  function populateScheduleTable(area, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = ""; // Clear the table body

    // Filter data for the selected area and date
    const filteredData = scheduleData.filter(
      (entry) => entry.area === area && entry.date === dateInput.value
    );

    // Group tasks by housekeeper
    const groupedData = {};
    filteredData.forEach((entry) => {
      if (!groupedData[entry.housekeeper]) {
        groupedData[entry.housekeeper] = [];
      }
      groupedData[entry.housekeeper].push(entry);
    });

    // Create table rows
    Object.entries(groupedData).forEach(([housekeeper, tasks]) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${housekeeper}</td>`;

      for (let i = 6; i <= 20; i += 0.5) {
        const hour = Math.floor(i);
        const minutes = i % 1 === 0 ? "00" : "30";
        const time = parseFloat(`${hour}.${minutes}`);

        const cell = document.createElement("td");
        cell.style.minWidth = "80px"; // Fixed width for columns
        const task = tasks.find((t) => t.start <= time && t.end > time);
        if (task) {
          if (
            row.lastElementChild &&
            row.lastElementChild.getAttribute("data-task") === task.task
          ) {
            // Merge cells for the same task
            row.lastElementChild.colSpan =
              parseInt(row.lastElementChild.colSpan || "1") + 1;
            continue; // Skip adding a new cell
          } else {
            cell.className = "task-cell";
            cell.textContent = task.task;
            cell.setAttribute("data-task", task.task);
            cell.style.backgroundColor = "#e9f7fc"; // Light blue for task cells
          }
        }
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    });
  }

  // Update schedule when date or tab changes
  function updateSchedule() {
    const activeTab = document.querySelector(".nav-link.active");
    const area = activeTab.id.split("-")[0]; // Get area from tab ID
    const tableBodyId = `${area}ScheduleBody`;
    populateScheduleTable(area, tableBodyId);
  }

  // Add event listeners
  dateInput.addEventListener("change", updateSchedule);
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.addEventListener("shown.bs.tab", updateSchedule);
  });

  // Populate the headers for all tables
  createHeader("scheduleHeader");
  createHeader("scheduleHeaderPool");
  createHeader("scheduleHeaderRoom");

  // Populate the default tab on page load
  updateSchedule();
});
