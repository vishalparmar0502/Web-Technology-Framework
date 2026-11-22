document.getElementById("show").addEventListener("click", function () {
    const value = document.getElementById("messageInput").value.trim();

    // textContent displays user input safely as text.
    document.getElementById("output").textContent =
        value || "Please enter a message.";
});

document.getElementById("check").addEventListener("click", function () {
    const password = document.getElementById("password").value;

    const strong =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(password);

    document.getElementById("passwordResult").textContent =
        strong
            ? "Password meets the demo policy."
            : "Use at least 10 characters with upper, lower, number and symbol.";
});