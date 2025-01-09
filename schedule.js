document.addEventListener("DOMContentLoaded", () => {
  // Set default date to today in dd/mm/yyyy format
  const dateInput = document.getElementById("scheduleDate");
  const today = formatDate(new Date());
  dateInput.value = formatDateForInput(new Date());
  // Sample schedule data with dd/mm/yyyy format
  // if (!localStorage.getItem("schedule")) {
  //   const sampleSchedule = [
  //     {
  //       hkId: "660001",
  //       hkName: "Somsri K. (Som)",
  //       date: "01/01/2025",
  //       startTime: 6,
  //       endTime: 10,
  //       zone: "Room",
  //       task: "Make Up",
  //       roomNo: "001",
  //     },
  //     {
  //       hkId: "660002",
  //       hkName: "Somjai L. (Jai)",
  //       date: "01/01/2025",
  //       startTime: 6,
  //       endTime: 10,
  //       zone: "Room",
  //       task: "Make Up",
  //       roomNo: "002",
  //     },
  //     {
  //       hkId: "660003",
  //       hkName: "Saiyai L. (Sai)",
  //       date: "01/01/2025",
  //       startTime: 10,
  //       endTime: 12,
  //       zone: "Room",
  //       task: "Check Out",
  //       roomNo: "003",
  //     },
  //     {
  //       hkId: "660007",
  //       hkName: "Chaijai L. (Chai)",
  //       date: "01/01/2025",
  //       startTime: 8,
  //       endTime: 17,
  //       zone: "Pool",
  //       task: "Pool 1",
  //       roomNo: "",
  //     },
  //   ];

  //   // Enrich the sample schedule with new fields
  //   const enrichedSchedule = sampleSchedule.map((entry, index) => ({
  //     ...entry,
  //     workorderId: generateWorkorderId(entry.date, index + 1),
  //     status: "to do", // Default status
  //     taskStatus: generateTaskStatus(entry.task),
  //     realStart: `Est. ${entry.startTime}:00`, // Initialize realStart
  //     realEnd: `Est. ${entry.endTime}:00`, // Initialize realEnd
  //   }));

  //   localStorage.setItem("schedule", JSON.stringify(enrichedSchedule));
  // }

  let scheduleData = JSON.parse(localStorage.getItem("schedule"));

  // CSV Parsing and Uploading
  document
    .getElementById("upload-schedule-btn")
    .addEventListener("click", () => {
      document.getElementById("schedule-file-input").click();
    });

  document
    .getElementById("schedule-file-input")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const csvData = e.target.result;
          try {
            const newSchedule = parseCSV(csvData);

            // Retrieve existing schedule
            let existingSchedule = localStorage.getItem("schedule");
            existingSchedule = existingSchedule
              ? JSON.parse(existingSchedule)
              : [];

            // Merge new schedule with existing schedule
            const updatedSchedule = [...existingSchedule, ...newSchedule];

            // Save updated schedule to local storage
            localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
            alert("Schedule uploaded and appended successfully!");

            // Update the schedule display
            scheduleData = updatedSchedule;
            updateSchedule();
          } catch (error) {
            alert(
              "Error parsing the file. Please ensure it matches the required format."
            );
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    });

  function parseCSV(data) {
    const rows = data.trim().split("\n");
    const headers = rows[0].split(",");
    const schedule = [];

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(",");
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = values[index] ? values[index].trim() : null;
      });

      // Map CSV fields to schedule fields
      schedule.push({
        hkId: entry["HK ID"],
        hkName: entry["HK Name"],
        date: entry["Date"], // Use dd/mm/yyyy format directly from CSV
        startTime: convertTimeToDecimal(entry["Start Time"]),
        endTime: convertTimeToDecimal(entry["End Time"]),
        zone: entry["Zone"],
        task: entry["Task"],
        roomNo: entry["Room No."] || null,
        workorderId: generateWorkorderId(entry["Date"], schedule.length + 1),
        status: "to do",
        taskStatus: generateTaskStatus(entry["Task"]),
        realStart: `Est. ${entry["Start Time"]}`,
        realEnd: `Est. ${entry["End Time"]}`,
      });
    }
    return schedule;
  }

  function convertTimeToDecimal(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format for HTML input type="date"
  }

  // Create the header dynamically
  function createHeader(headerId) {
    const headerRow = document.getElementById(headerId);
    for (let i = 6; i <= 20; i += 0.5) {
      const hour = Math.floor(i);
      const minutes = i % 1 === 0 ? "00" : "30";
      const column = document.createElement("th");
      column.style.minWidth = "40px"; // Fixed width for columns
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
      (entry) =>
        entry.zone.toLowerCase() === area &&
        entry.date === formatDate(new Date(dateInput.value)) // Compare with dd/mm/yyyy format
    );

    // Group tasks by housekeeper
    const groupedData = {};
    filteredData.forEach((entry) => {
      if (!groupedData[entry.hkName]) {
        groupedData[entry.hkName] = [];
      }
      groupedData[entry.hkName].push(entry);
    });

    // Create table rows
    Object.entries(groupedData).forEach(([hkName, tasks]) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td style="min-width: 150px;">${hkName}</td>`;

      for (let i = 6; i <= 20; i += 0.5) {
        const hour = Math.floor(i);
        const minutes = i % 1 === 0 ? "00" : "30";
        const time = parseFloat(`${hour}.${minutes}`);

        const cell = document.createElement("td");
        cell.style.minWidth = "80px"; // Fixed width for columns
        const task = tasks.find((t) => t.startTime <= time && t.endTime > time);
        if (task) {
          if (
            row.lastElementChild &&
            row.lastElementChild.getAttribute("data-task") === task.task
          ) {
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

  // New Functions for Enhanced Schedule Format

  // Generate workorderId
  function generateWorkorderId(date, index) {
    const formattedDate = date.replaceAll("-", "");
    const runningNumber = String(index).padStart(3, "0");
    return `${formattedDate}-${runningNumber}`;
  }

  // Generate taskStatus
  function generateTaskStatus(task) {
    const subtasks =
      task === "Make Up"
        ? [
            "06:00 - เริ่มงาน ทำความสะอาดหน้าหาด",
            "08:00 - เบิกผ้า กรณีลูกค้าพักคืนที่ 2 ขึ้นไป",
            `08:30 -  เริ่มทำความสะอาดห้อง
                      เปลี่ยนผ้าปูที่นอน ปลอกหมอน ผ้าห่ม ผ้าเช็คตัว
                      นับจำนวนมินิบาร์ที่ต้องเติม`,
            "12:30 - พักกลางวัน",
            "13:15 - เบิกมินิบาร์",
            `14:00 -  เริ่มทำความสะอาดห้องต่อ
                      เติมมินิบาร์
                      ทำความสะอาดห้อง
                      แยกขยะก่อนนำลงมาทิ้ง`,
            "16:00 - จบงาน",
          ]
        : task === "Check Out"
        ? [
            "ตรวจสอบทรัพย์สินลูกค้า",
            "ตรวจสอบทรัพย์สินรีสอร์ท",
            "เริ่มทำความสะอาด",
            "1. ห้องน้ำ",
            "2. อ่างล้างหน้า",
            "3. ทำความสะอาดโต๊ะ",
            "4. ตู้เสื้อผ้า",
            "5. เตียงนอน",
            "6. ทำความสะอาดภายในห้องพัก",
            "7. ทำความสะอาดภายนอกห้องพัก",
            "8. ตรวจสอบไฟ",
            "9. ปิดประตู",
            "ความสะอาดโดยรอบ",
            "เก็บอุปกรณ์",
            "แยกขยะก่อนที่จะนำลงมาทิ้ง",
            "จบงาน",
          ]
        : task === "Front Morning"
        ? [
            "เริ่มงาน",
            "ทำความสะอาดในบริเวณ Front Office กวาดพื้นห้อง ถูพื้นห้อง เช็คฝุ่น เช็ดเคาน์เตอร์ จัดโต๊ะทำงานใน Office ทำความสะอาดห้องน้ำ Front Office",
            "ทำความสะอาดรอบนอก Front Office กวาดพื้น เช็ดฝุ่นโต๊ะรับแขก จัดให้เป็นระเบียบ ทำความสะอาดห้องน้ำของลูกค้าผู้ชาย ทำความสะอาดห้องน้ำของลูกค้าผู้หญิง",
            "ปูเตียงเปลยวน",
            "จบงาน",
          ]
        : task === "Front Afternoon"
        ? [
            "เริ่มงาน",
            "ทำความสะอาดในบริเวณ Front Office กวาดพื้นห้อง ถูพื้นห้อง เช็คฝุ่น เช็ดเคาน์เตอร์ จัดโต๊ะทำงานใน Office ทำความสะอาดห้องน้ำ Front Office",
            "ทำความสะอาดรอบนอก Front Office กวาดพื้น เช็ดฝุ่นโต๊ะรับแขก จัดให้เป็นระเบียบ ทำความสะอาดห้องน้ำของลูกค้าผู้ชาย ทำความสะอาดห้องน้ำของลูกค้าผู้หญิง",
            "ปูเตียงเปลยวน",
            "ตักน้ำขังในร่องระบายน้ำ (กรณีถ้ามีน้ำขัง)",
            "เก็บขยะใน Front Office และโดยรอบ",
            "จบงาน",
          ]
        : task === "Equipment"
        ? [
            "เริ่มงาน",
            "ให้บริการลูกค้าที่ต้องการเช่าอุปกรณ์ดำน้ำ",
            "ทำความสะอาดล้างและเช็คเก็บอุปกรณ์เช่าต่าง ๆ",
            "จบงาน",
          ]
        : task === "Welcome"
        ? [
            "เริ่มงาน",
            "เตรียม Welcome Set",
            "บริการเสริฟ Welcome Set ให้ลูกค้าที่มา Check In",
            "ล้างทำความสะอาดตู้ข้าวโพดและเก็บเข้าที่ให้เรียบร้อย",
            "เก็บผ้าเย็นที่ใช้แล้วมาซัก",
            "ทำความสะอาดล้างและเช็คเก็บอุปกรณ์เช่าต่าง ๆ",
            "จบงาน",
          ]
        : task === "Pool 1"
        ? [
            "08:00 - เริ่มงาน",
            "ลงพื้นที่ห้องพักที่มีสระน้ำ ทำความสะอาด ตักใบไม้ ",
            "ทำความสะอาดอุปกรณ์ในบริเวณสระว่ายน้ำ และเก็บให้เรียบร้อยในที่สำหรับจัดเก็บอุปกรณ์",
            "เบิกผ้า HK แจกที่โซน 6",
            "เบิกผ้าสระเตรียมให้ลูกค้าที่มาใช้บริการ",
            "ช่วยงานในส่วนของ Bell Boy กรณีมีพนักงานไม่เพียงพอ",
            "17:00 - จบงาน",
          ]
        : task === "Pool 2"
        ? [
            "09:00 - เริ่มงาน",
            "ทำความสะอาดรอบสระน้ำ",
            "1. รดน้ำต้นไม้ ตักใบไม้",
            "2. เช็คเตียงสระน้ำ ปูผ้า เบาะ กางร่มให้ลูกค้า",
            "3. ล้างห้องน้ำ",
            "วัดค่าสระน้ำ",
            "1. ระดับน้ำสระ",
            "2. ค่าน้ำคลอรีน",
            "3. ดูดตะกอนในสระน้ำ",
            "Stand By ที่สระว่ายน้ำแจกผ้าเช็ดตัวให้กับลูกค้า",
            "ทำความสะอาดอุปกรณ์ในบริเวณสระว่ายน้ำ และเก็บให้เรียบร้อยในที่สำหรับจัดเก็บอุปกรณ์",
            "เบิกผ้า HK แจกที่โซน 6",
            "เบิกผ้าสระเตรียมให้ลูกค้าที่มาใช้บริการ",
            "ช่วยงานในส่วนของ Bell Boy กรณีมีพนักงานไม่เพียงพอ",
            "เก็บเบาะพร้อมทำความสะอาดเมื่อน้ำตกปิด",
            "20:00 - จบงาน",
          ]
        : ["General Task"];
    return subtasks.map((subtask) => ({ subtask, completed: false }));
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
