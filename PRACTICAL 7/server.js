const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET || "change-this-demo-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 30 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, "public")));

const demoUser = {
    username: "student",
    password: "Library@123"
};

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/");
    }
    next();
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.send("<h1>Central City Library</h1><p>Library information page.</p><a href='/'>Home</a>");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === demoUser.username && password === demoUser.password) {
        req.session.user = { username };
        return res.json({
            success: true,
            message: "Login successful."
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password."
    });
});

app.get("/dashboard", requireLogin, (req, res) => {
    res.send(`<h1>Welcome ${req.session.user.username}</h1><p>Protected library dashboard.</p><a href='/logout'>Logout</a>`);
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

app.listen(PORT, () => {
    console.log(`Library server running at http://localhost:${PORT}`);
});