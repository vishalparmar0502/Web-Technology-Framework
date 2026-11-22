const message = document.getElementById("message");

const basket = document.getElementById("basket");

const description = document.querySelector("#description");

document.getElementById("details").addEventListener("click", function () {
    description.textContent = "Details: water-resistant fabric, padded laptop sleeve and 20 litre capacity.";
    description.style.color = "#70477b";
});

document.getElementById("add").addEventListener("click", function () {
    const item = document.createElement("li");
    item.textContent = "Everyday Backpack added";
    basket.appendChild(item);
    message.textContent = "Product added to your basket.";
});

document.getElementById("theme").addEventListener("click", function () {
    document.body.classList.toggle("dark");
});

document.getElementById("note").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && this.value.trim() !== "") {
        document.getElementById("noteOutput").textContent = "Note: " + this.value.trim();
        this.value = "";
    }
});

document.getElementById("add").addEventListener("mouseover", () => {
    message.textContent = "Ready to add this product.";
});

document.getElementById("add").addEventListener("mouseout", () => {
    message.textContent = "";
});

// Other DOM selection methods demonstrated for practice

const buttons = document.getElementsByTagName("button");

const productCards = document.getElementsByClassName("product");

console.log("Buttons:", buttons.length, "Product cards:", productCards.length);

document.querySelectorAll("main p").forEach((element) => {
    element.setAttribute("data-section", "store");
});
