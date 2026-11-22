const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

let products = [
    {
        id: 1,
        title: "Canvas Backpack",
        price: 899,
        category: "bags"
    },
    {
        id: 2,
        title: "Desk Lamp",
        price: 499,
        category: "home"
    }
];

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const item = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!item) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(item);
});

app.post("/api/products", (req, res) => {
    const title = String(req.body.title || "").trim();

    if (!title || title.length > 80) {
        return res.status(400).json({
            message: "A title up to 80 characters is required."
        });
    }

    const item = {
        id: Date.now(),
        title,
        price: 0,
        category: "new"
    };

    products.push(item);

    res.status(201).json(item);
});

app.listen(3000, () => {
    console.log("QuickShop API at http://localhost:3000");
});