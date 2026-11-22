const form = document.getElementById("productForm");
const statusBox = document.getElementById("status");
const list = document.getElementById("products");

let editingId = null;

async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

async function loadProducts() {
    try {
        const products = await request("/api/products");

        list.replaceChildren();

        products.forEach(p => {
            const card = document.createElement("article");
            card.className = "product";

            const heading = document.createElement("h3");
            heading.textContent = p.name;

            const details = document.createElement("p");

            details.textContent =
                "Product ID: " + p.product_code +
                " | Category: " + p.category +
                " | Price: ₹" + p.price +
                " | Quantity: " + p.quantity +
                " | Description: " + (p.description || "");

            const edit = document.createElement("button");
            edit.textContent = "Edit";

            edit.addEventListener("click", () => fillForm(p));

            const remove = document.createElement("button");
            remove.textContent = "Delete";

            remove.addEventListener("click", async () => {
                if (confirm("Delete this product?")) {
                    try {
                        await request("/api/products/" + p.id, {
                            method: "DELETE"
                        });

                        statusBox.textContent = "Product deleted.";
                        await loadProducts();

                    } catch (e) {
                        statusBox.textContent = e.message;
                    }
                }
            });

            card.append(heading, details, edit, remove);
            list.appendChild(card);
        });

    } catch (e) {
        statusBox.textContent = e.message;
    }
}

function fillForm(p) {
    editingId = p.id;

    document.getElementById("code").value = p.product_code;
    document.getElementById("name").value = p.name;
    document.getElementById("category").value = p.category;
    document.getElementById("price").value = p.price;
    document.getElementById("quantity").value = p.quantity;
    document.getElementById("description").value = p.description || "";

    statusBox.textContent = "Editing product: " + p.name;
}

form.addEventListener("submit", async e => {
    e.preventDefault();

    const body = Object.fromEntries(
        ["code", "name", "category", "price", "quantity", "description"]
            .map(id => [
                id,
                document.getElementById(id).value.trim()
            ])
    );

    try {
        const url = editingId
            ? "/api/products/" + editingId
            : "/api/products";

        await request(url, {
            method: editingId ? "PUT" : "POST",
            body: JSON.stringify(body)
        });

        statusBox.textContent = "Saved successfully.";

        form.reset();
        editingId = null;

        await loadProducts();

    } catch (err) {
        statusBox.textContent = err.message;
    }
});

document.getElementById("reset").addEventListener("click", () => {
    editingId = null;
    form.reset();
    statusBox.textContent = "";
});

loadProducts();