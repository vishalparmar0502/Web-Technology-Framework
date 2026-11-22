const results = document.getElementById("results");
const statusBox = document.getElementById("status");

async function apiRequest(url, options) {
    const response = await fetch(url, options);

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Server returned invalid JSON.");
    }

    if (!response.ok) {
        throw new Error(
            `Request failed (${response.status}): ${data.message || response.statusText}`
        );
    }

    return data;
}

function displayProducts(items) {
    results.replaceChildren();

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "card";

        const heading = document.createElement("h3");
        heading.textContent = item.title;

        const price = document.createElement("p");
        price.textContent = "Price: ₹" + item.price;

        const category = document.createElement("p");
        category.textContent = "Category: " + item.category;

        card.append(heading, price, category);

        results.appendChild(card);
    });
}

async function loadProducts(query = "") {
    statusBox.textContent = "Loading products...";

    try {
        const data = await apiRequest("/api/products");

        const filtered = data.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase())
        );

        displayProducts(filtered);

        statusBox.textContent =
            `${filtered.length} product(s) displayed.`;

    } catch (error) {
        statusBox.textContent = error.message;
    }
}

document.getElementById("searchForm").addEventListener("submit", e => {
    e.preventDefault();

    loadProducts(
        document.getElementById("search").value.trim()
    );
});

document.getElementById("addForm").addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const created = await apiRequest("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: document.getElementById("newTitle").value.trim()
            })
        });

        statusBox.textContent =
            "Created product with ID " + created.id;

        e.target.reset();

        await loadProducts();

    } catch (error) {
        statusBox.textContent = error.message;
    }
});

loadProducts();