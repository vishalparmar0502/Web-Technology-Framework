const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const db = new Database("campusconnect.db");
const PORT = process.env.PORT || 3000;

db.exec(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        event_date TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL
    )
`);

const count = db.prepare("SELECT COUNT(*) AS total FROM events").get().total;

if (count === 0) {
    const insert = db.prepare(
        "INSERT INTO events (title, category, event_date, location, description) VALUES (?, ?, ?, ?, ?)"
    );

    insert.run(
        "Web Development Workshop",
        "Workshop",
        "2027-01-15",
        "Computer Lab",
        "Build your first responsive page."
    );

    insert.run(
        "Design Meetup",
        "Community",
        "2027-01-22",
        "Seminar Hall",
        "Share ideas and learn design basics."
    );
}

app.use(express.json({ limit: "20kb" }));

app.use(express.static(path.join(__dirname, "public")));

function clean(value, max) {
    return String(value || "").trim().slice(0, max);
}

function validate(body) {
    const event = {
        title: clean(body.title, 80),
        category: clean(body.category, 40),
        location: clean(body.location, 80),
        date: clean(body.date, 10),
        description: clean(body.description, 300)
    };

    if (
        !event.title ||
        !event.category ||
        !/^\d{4}-\d{2}-\d{2}$/.test(event.date) ||
        !event.location ||
        !event.description
    ) {
        throw new Error("Complete all fields with valid values.");
    }

    return event;
}

app.get("/api/events", (req, res) => {
    const rows = db.prepare(
        "SELECT * FROM events ORDER BY event_date"
    ).all();

    res.json(rows);
});

app.post("/api/events", (req, res) => {
    try {
        const e = validate(req.body);

        const result = db.prepare(`
            INSERT INTO events
            (title, category, event_date, location, description)
            VALUES (@title, @category, @date, @location, @description)
        `).run(e);

        res.status(201).json({
            id: result.lastInsertRowid,
            message: "Event added."
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Unexpected server error."
    });
});

app.listen(PORT, () => {
    console.log(`CampusConnect running at http://localhost:${PORT}`);
});