async function getData() {
    try {
        const response = await fetch("https://bored-api.appbrewery.com/random"
        );

        const data = await response.json();

        console.log("Activity:", data.activity);
        console.log("Type:", data.type);
        console.log("Participants:", data.participants);
        console.log("Price:", data.price);

    } catch (error) {
        console.log("Error:", error);
    }
}

getData();