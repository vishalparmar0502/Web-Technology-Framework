const eventList = document.getElementById("eventList");
const statusBox = document.getElementById("status");

let allEvents = [];

async function api(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed.");
    }

    return data;
}

function renderEvents(events) {
    eventList.replaceChildren();

    if (!events.length) {
        statusBox.textContent = "No matching events found.";
        return;
    }

    events.forEach(event => {
        const card = document.createElement("article");
        card.className = "event-card";

        const heading = document.createElement("h3");
        heading.textContent = event.title;

        const category = document.createElement("p");
        category.textContent = event.category;

        const date = document.createElement("p");
        date.textContent = event.event_date + " · " + event.location;

        const description = document.createElement("p");
        description.textContent = event.description;

        card.append(heading, category, date, description);

        eventList.appendChild(card);
    });

    statusBox.textContent = events.length + " event(s) available.";
}

async function loadEvents() {
    statusBox.textContent = "Loading events...";

    try {
        allEvents = await api("/api/events");
        renderEvents(allEvents);

    } catch (error) {
        statusBox.textContent =
            error.message + " Check that the server is running.";
    }
}

document.getElementById("search").addEventListener("input", function () {
    const term = this.value.trim().toLowerCase();

    renderEvents(
        allEvents.filter(event =>
            (
                event.title + " " +
                event.category + " " +
                event.location
            ).toLowerCase().includes(term)
        )
    );
});

document.getElementById("eventForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const body = Object.fromEntries(
        ["title", "category", "date", "location", "description"].map(id => [
            id,
            document.getElementById(id).value.trim()
        ])
    );

    try {
        await api("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        this.reset();
        await loadEvents();

        statusBox.textContent = "Event submitted successfully.";

    } catch (error) {
        statusBox.textContent = error.message;
    }
});

loadEvents();