const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "techmart",
    waitForConnections: true,
    connectionLimit: 5
});

function cleanText(value, max = 300) {
    return String(value ?? "").trim().slice(0, max);
}

function validateProduct(body) {
    const product = {
        code: cleanText(body.code, 30),
        name: cleanText(body.name, 80),
        category: cleanText(body.category, 50),
        price: Number(body.price),
        quantity: Number(body.quantity),
        description: cleanText(body.description, 300)
    };

    if (
        !product.code ||
        !product.name ||
        !product.category ||
        !Number.isFinite(product.price) ||
        product.price <= 0 ||
        !Number.isInteger(product.quantity) ||
        product.quantity < 0
    ) {
        throw new Error("Enter valid product details.");
    }

    return product;
}

app.get("/api/products", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM products ORDER BY id DESC"
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Could not load products."
        });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const p = validateProduct(req.body);

        const [result] = await pool.execute(
            `INSERT INTO products
            (product_code, name, category, price, quantity, description)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                p.code,
                p.name,
                p.category,
                p.price,
                p.quantity,
                p.description
            ]
        );

        res.status(201).json({
            id: result.insertId,
            message: "Product created."
        });
    } catch (err) {
        console.error(err);
        res.status(err.code === "ER_DUP_ENTRY" ? 409 : 400).json({
            message: err.code === "ER_DUP_ENTRY"
                ? "Product ID already exists."
                : err.message
        });
    }
});

app.put("/api/products/:id", async (req, res) => {
    try {
        const p = validateProduct(req.body);
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const [result] = await pool.execute(
            `UPDATE products SET
            product_code = ?, name = ?, category = ?,
            price = ?, quantity = ?, description = ?
            WHERE id = ?`,
            [
                p.code,
                p.name,
                p.category,
                p.price,
                p.quantity,
                p.description,
                id
            ]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.json({
            message: "Product updated."
        });
    } catch (err) {
        console.error(err);
        res.status(err.code === "ER_DUP_ENTRY" ? 409 : 400).json({
            message: err.code === "ER_DUP_ENTRY"
                ? "Product ID already exists."
                : err.message
        });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const [result] = await pool.execute(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.json({
            message: "Product deleted."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Delete failed."
        });
    }
});

app.listen(3000, () => {
    console.log("TechMart server: http://localhost:3000");
});