document.addEventListener("DOMContentLoaded", () => {
  const scheduleData = JSON.parse(localStorage.getItem("schedule")) || [];

  // Helper function to populate the table based on the selected zone
  function populateTable(zone) {
    console.log(`Populating table for zone: ${zone}`); // Debugging log

    // Convert the zone to lowercase to match the table ID
    const tableBody = document.querySelector(`#${zone}ZoneTable tbody`);

    // Check if the tableBody exists
    if (!tableBody) {
      console.error(`Table body for zone ${zone} not found!`);
      return;
    }

    tableBody.innerHTML = ""; // Clear existing rows

    // Filter tasks by zone (case-sensitive match)
    const filteredTasks = scheduleData.filter(
      (task) => task.zone.toLowerCase() === zone // Match zone exactly
    );

    console.log(`Filtered tasks for ${zone}:`, filteredTasks); // Debugging log

    // If no tasks found, display a message
    if (filteredTasks.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="6" class="text-center">No tasks found for this zone.</td>`;
      tableBody.appendChild(row);
      return;
    }

    // Populate rows for each housekeeper and task
    filteredTasks.forEach((task) => {
      const upcomingTask = getUpcomingTask(task.hkName);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="#" class="wo-link" data-wo="${task.workorderId}">${
        task.hkName
      }</a></td>
        <td>${task.task}</td>
        <td>${task.status}</td>
        <td>${task.realStart}</td>
        <td>${task.realEnd}</td>
        <td>${
          upcomingTask
            ? `${upcomingTask.task} (Est. ${upcomingTask.realStart})`
            : "No upcoming task"
        }</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // woLink handler
  document.body.addEventListener("click", (e) => {
    const woLink = e.target.closest(".wo-link");
    if (woLink) {
      const workorderId = woLink.getAttribute("data-wo");
      if (workorderId) {
        // Navigate to roomdetail.html with the room number as a query parameter
        window.location.href = `roomdetail.html?workorderId=${encodeURIComponent(
          workorderId
        )}`;
      }
    }
  });

  // Helper function to get the upcoming task for a given housekeeper
  function getUpcomingTask(hkName) {
    const tasks = scheduleData.filter(
      (task) => task.hkName === hkName && task.status === "to do"
    );
    return tasks.length > 0 ? tasks[0] : null;
  }

  // Event listener for zone tab switching
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.addEventListener("shown.bs.tab", (e) => {
      const zone = e.target.id.split("-")[0]; // Get zone from tab ID (Service, Pool, Room)
      console.log(`Tab switched to zone: ${zone}`); // Debugging log
      populateTable(zone); // Populate the correct table for the selected zone
    });
  });

  // Set default tab and load its data
  populateTable("service"); // Default to Service zone when page loads
});
