document.addEventListener("DOMContentLoaded", () => {
  // Parse the workorderId from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const workorderId = urlParams.get("workorderId");

  // Fetch task data from localStorage
  const scheduleData = JSON.parse(localStorage.getItem("schedule")) || [];
  const taskData = scheduleData.find(
    (task) => task.workorderId === workorderId
  );

  if (!taskData) {
    alert("Work order data not found!");
    return;
  }

  const housekeeper = taskData.hkName || "N/A";

  // Populate room details
  document.getElementById("roomNumber").textContent = taskData.roomNo || "N/A";
  document.getElementById("housekeeper").textContent = housekeeper;

  // Set Room Detail breadcrumb link
  const roomDetailBreadcrumb = document.getElementById("roomDetailBreadcrumb");
  roomDetailBreadcrumb.href = `roomdetail.html?workorderId=${encodeURIComponent(
    workorderId
  )}`;

  // Form submission handler
  document
    .getElementById("lostAndFoundForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const lostItem = document.getElementById("lostItem").value;
      const uploadedFile = document.getElementById("uploadPicture").files[0];

      // Validate input fields
      if (!lostItem) {
        alert("Please describe the lost item.");
        return;
      }

      if (!uploadedFile) {
        alert("Please upload a picture.");
        return;
      }

      // Save the lost and found data
      const lostAndFoundData =
        JSON.parse(localStorage.getItem("lostandfound")) || [];
      lostAndFoundData.push({
        lostitem: lostItem,
        picture: uploadedFile.name,
        workorderId: workorderId,
        time: new Date().toISOString(),
      });
      localStorage.setItem("lostandfound", JSON.stringify(lostAndFoundData));

      alert("Lost and Found data submitted successfully!");

      // Reset the form
      document.getElementById("lostAndFoundForm").reset();
    });
});
