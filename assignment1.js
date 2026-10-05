async function fetchData() {
  try {
    const response = await fetch("https://bored-api.appbrewery.com/random");

    const data = await response.json();

    console.log("1. Activity: " + data.activity);
    console.log("2. Type: " + data.type);
    console.log("3. Participants: " + data.participants);
    console.log("4. Price: " + data.price);
  } catch (error) {
    console.log("Something went wrong:", error.message);
  }
}

fetchData();
