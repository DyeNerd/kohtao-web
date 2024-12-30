// Sample room data
const sampleRoomData = [
  {
    roomNumber: "101",
    area: "service",
    status: "Clean",
    housekeeper: "Alice",
    lostAndFound: "None",
    minibarStock: "Full",
    taskStatus: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    },
  },
  {
    roomNumber: "102",
    area: "pool",
    status: "Dirty",
    housekeeper: null,
    lostAndFound: "Sunglasses",
    minibarStock: "Low",
    taskStatus: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    },
  },
  {
    roomNumber: "103",
    area: "room",
    status: "Occupied",
    housekeeper: "Bob",
    lostAndFound: "None",
    minibarStock: "Partial",
    taskStatus: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    },
  },
  {
    roomNumber: "104",
    area: "service",
    status: "Clean",
    housekeeper: null,
    lostAndFound: "Wallet",
    minibarStock: "Full",
    taskStatus: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    },
  },
  {
    roomNumber: "105",
    area: "pool",
    status: "Occupied",
    housekeeper: "Charlie",
    lostAndFound: "None",
    minibarStock: "Low",
    taskStatus: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
    },
  },
];

// Sample housekeepers data
const sampleHousekeepers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

// Save data to localStorage
localStorage.setItem("roomData", JSON.stringify(sampleRoomData));
localStorage.setItem("housekeepers", JSON.stringify(sampleHousekeepers));

console.log("Sample data has been added to localStorage.");
