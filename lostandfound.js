document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomNumber = urlParams.get("room");

  // Fetch housekeeper data from localStorage
  const roomData = JSON.parse(localStorage.getItem("roomData")) || [];
  const housekeeper =
    roomData.find((room) => room.roomNumber === roomNumber)?.housekeeper ||
    "N/A";

  // Set room details
  document.getElementById("roomNumber").textContent = roomNumber || "N/A";
  document.getElementById("housekeeper").textContent = housekeeper;

  // Set the Room Detail breadcrumb link
  const roomDetailBreadcrumb = document.getElementById("roomDetailBreadcrumb");
  roomDetailBreadcrumb.href = `roomdetail.html?room=${encodeURIComponent(
    roomNumber
  )}`;
  //   roomDetailBreadcrumb.textContent = `Room Detail - ${roomNumber}`;

  // File upload handling
  const uploadContainer = document.getElementById("uploadContainer");
  const uploadInput = document.getElementById("uploadPicture");

  uploadContainer.addEventListener("click", () => {
    uploadInput.click();
  });

  uploadInput.addEventListener("change", () => {
    const fileName = uploadInput.files[0]?.name || "No file chosen";
    uploadContainer.innerHTML = `<p>${fileName}</p>`;
  });

  // Form submission handler
  document
    .getElementById("lostAndFoundForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const lostItem = document.getElementById("lostItem").value;
      const uploadedFile = document.getElementById("uploadPicture").files[0];

      if (!uploadedFile) {
        alert("Please upload a picture.");
        return;
      }

      // Save the lost item data
      const lostAndFoundData =
        JSON.parse(localStorage.getItem("lostAndFound")) || [];
      lostAndFoundData.push({
        roomNumber,
        housekeeper,
        lostItem,
        uploadedFileName: uploadedFile.name,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("lostAndFound", JSON.stringify(lostAndFoundData));

      alert("Lost and Found data submitted successfully!");
      document.getElementById("lostAndFoundForm").reset();
    });
});
