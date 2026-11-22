const packageArea = document.getElementById("packages");

const statusText = document.getElementById("status");

const destinationSelect = document.getElementById("destination");

// Callback example: runs after a short simulated task.

function showMessage(message, callback) {
    setTimeout(function () {
        statusText.textContent = message;

        if (callback) {
            callback();
        }
    }, 500);
}

showMessage("Welcome to WanderGo. Preparing travel ideas...", function () {
    console.log("Welcome message displayed.");
});

const offers = [
    "Early bird: save on selected weekend trips.",
    "Plan ahead and explore more for less."
];

let offerIndex = 0;

document.getElementById("offer").textContent = offers[0];

setInterval(function () {
    offerIndex = (offerIndex + 1) % offers.length;

    document.getElementById("offer").textContent = offers[offerIndex];
}, 5000);

async function loadPackages() {
    try {

        // Fetch a local JSON file; run through a local server, not file://

        const response = await fetch("packages.json");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const packages = await response.json();

        packageArea.innerHTML = "";

        packages.forEach(function (trip) {

            const card = document.createElement("article");

            card.className = "card";

            card.textContent = trip.destination;

            packageArea.appendChild(card);

            const option = document.createElement("option");

            option.value = trip.destination;

            option.textContent = trip.destination;

            destinationSelect.appendChild(option);

        });

        statusText.textContent = "Travel packages loaded.";

    } catch (error) {

        statusText.textContent = "Packages could not be loaded. Check the local server and packages.json.";

        console.error(error);

    }
}

destinationSelect.addEventListener("change", function () {

    localStorage.setItem("preferredDestination", this.value);

    sessionStorage.setItem("lastSelectedDuringSession", this.value);

    document.getElementById("saved").textContent = this.value
        ? "Saved preference: " + this.value
        : "";

});

const savedDestination = localStorage.getItem("preferredDestination");

if (savedDestination) {
    document.getElementById("saved").textContent = "Saved preference: " + savedDestination;
}

document.getElementById("theme").addEventListener("click", function () {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkTheme",
        document.body.classList.contains("dark") ? "yes" : "no"
    );

});

if (localStorage.getItem("darkTheme") === "yes") {
    document.body.classList.add("dark");
}

loadPackages();
