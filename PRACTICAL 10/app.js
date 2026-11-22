const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "finsecure",
    waitForConnections: true,
    connectionLimit: 5
});

app.post("/register", async (req, res) => {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (
        !/^[A-Za-z0-9_]{3,30}$/.test(username) ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(password)
    ) {
        return res.status(400).json({
            message: "Invalid username or password policy."
        });
    }

    try {
        const hash = await bcrypt.hash(password, 12);

        await pool.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            [username, hash]
        );

        res.status(201).json({
            message: "Account created."
        });

    } catch (error) {
        console.error("Registration error:", error.code || error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Username already exists."
            });
        }

        res.status(500).json({
            message: "Could not create account."
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const username = String(req.body.username || "").trim();
        const password = String(req.body.password || "");

        const [rows] = await pool.execute(
            "SELECT id, password_hash FROM users WHERE username = ?",
            [username]
        );

        if (
            !rows.length ||
            !(await bcrypt.compare(password, rows[0].password_hash))
        ) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

        res.json({
            message: "Credentials accepted. Add session handling before production use."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login unavailable."
        });
    }
});

app.listen(3000, () => {
    console.log("FinSecure demo server on port 3000");
});