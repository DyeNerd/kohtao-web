document.addEventListener("DOMContentLoaded", () => {
  // Parse the workorderId from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const workorderId = urlParams.get("workorderId");

  // Fetch schedule data from localStorage
  const schedule = JSON.parse(localStorage.getItem("schedule")) || [];

  // Find the matching task based on workorderId
  const task = schedule.find((task) => task.workorderId === workorderId) || {};
  console.log(task);
  const housekeeper = task.hkName || "N/A";
  const roomNumber = task.roomNo || "N/A";

  // Load stock data from localStorage or initialize it
  const allStockData = JSON.parse(localStorage.getItem("stockData")) || {};
  if (!allStockData[roomNumber]) {
    allStockData[roomNumber] = [
      { product: "Coke", standard: 2, left: 0 },
      { product: "Sprite", standard: 3, left: 0 },
      { product: "Water", standard: 4, left: 0 },
      { product: "Coffee", standard: 2, left: 0 },
      { product: "Tea", standard: 2, left: 0 },
    ];
    localStorage.setItem("stockData", JSON.stringify(allStockData));
  }

  const stockData = allStockData[roomNumber];

  // Populate room details
  document.getElementById("roomNumber").textContent = roomNumber;
  document.getElementById("housekeeper").textContent = housekeeper;

  // Populate stock table
  const stockTableBody = document.getElementById("stockTableBody");

  stockData.forEach((item, index) => {
    const toBeFilled = item.standard - item.left;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.product}</td>
      <td>${item.standard}</td>
      <td>
        <select class="form-select" data-index="${index}" data-field="left">
          ${Array.from(
            { length: item.standard + 1 },
            (_, i) =>
              `<option value="${i}" ${
                i === item.left ? "selected" : ""
              }>${i}</option>`
          ).join("")}
        </select>
      </td>
      <td class="to-be-filled">${toBeFilled}</td>
      <td>
        <select class="form-select" data-index="${index}" data-field="actualFilled">
          ${Array.from(
            { length: toBeFilled + 1 },
            (_, i) => `<option value="${i}">${i}</option>`
          ).join("")}
        </select>
      </td>
      <td>
        <select class="form-select" data-index="${index}" data-field="remark">
          <option value="-" selected>-</option>
          <option value="Out of stock">Out of stock</option>
        </select>
      </td>
    `;

    stockTableBody.appendChild(row);
  });

  // Update "To be filled" and save changes when "Left" changes
  stockTableBody.addEventListener("change", (e) => {
    const target = e.target;
    const index = target.getAttribute("data-index");
    const field = target.getAttribute("data-field");

    if (field === "left") {
      const newLeftValue = parseInt(target.value);

      // Update stock data
      stockData[index].left = newLeftValue;
      stockData[index].toBeFilled = stockData[index].standard - newLeftValue;

      // Update "To be filled" column
      const toBeFilledCell = target
        .closest("tr")
        .querySelector(".to-be-filled");
      toBeFilledCell.textContent = stockData[index].toBeFilled;

      // Update "Actual Filled" dropdown
      const actualFilledSelect = target
        .closest("tr")
        .querySelector(`select[data-field="actualFilled"]`);
      actualFilledSelect.innerHTML = Array.from(
        { length: stockData[index].toBeFilled + 1 },
        (_, i) => `<option value="${i}">${i}</option>`
      ).join("");

      // Save to localStorage
      allStockData[roomNumber] = stockData;
      localStorage.setItem("stockData", JSON.stringify(allStockData));
    }
  });

  // Handle Complete button click
  document.getElementById("completeButton").addEventListener("click", () => {
    const updatedStockData = stockData.map((item, index) => {
      const leftSelect = document.querySelector(
        `select[data-index="${index}"][data-field="left"]`
      );
      const actualFilledSelect = document.querySelector(
        `select[data-index="${index}"][data-field="actualFilled"]`
      );
      const remarkSelect = document.querySelector(
        `select[data-index="${index}"][data-field="remark"]`
      );

      return {
        product: item.product,
        standard: item.standard,
        left: parseInt(leftSelect.value),
        toBeFilled: item.standard - parseInt(leftSelect.value),
        actualFilled: parseInt(actualFilledSelect.value),
        remark: remarkSelect.value,
      };
    });

    // Save the updated data to localStorage
    allStockData[roomNumber] = updatedStockData;
    localStorage.setItem("stockData", JSON.stringify(allStockData));

    alert("Stock data updated successfully!");

    window.location.href = `roomdetail.html?workorderId=${encodeURIComponent(
      workorderId
    )}`;
  });

  // Set breadcrumb link to Room Detail
  const roomDetailBreadcrumb = document.getElementById("roomDetailBreadcrumb");
  roomDetailBreadcrumb.href = `roomdetail.html?workorderId=${encodeURIComponent(
    workorderId
  )}`;
});
