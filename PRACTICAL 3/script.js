
const amountInput = document.getElementById("amount");
const rateInput = document.getElementById("rate");
const monthsInput = document.getElementById("months");
const result = document.getElementById("result");

function calculateEMI(principal, annualRate, months) {
    const monthlyRate = annualRate / 12 / 100;

    if (monthlyRate === 0)
        return principal / months;

    const factor = Math.pow(1 + monthlyRate, months);

    return principal * monthlyRate * factor / (factor - 1);
}

document.getElementById("calculate").addEventListener("click", function () {

    const principal = Number(amountInput.value);
    const rate = Number(rateInput.value);
    const months = Number(monthsInput.value);

    if (
        amountInput.value === "" ||
        rateInput.value === "" ||
        monthsInput.value === "" ||
        principal <= 0 ||
        rate < 0 ||
        months <= 0
    ) {
        result.textContent = "Enter valid loan and tenure values.";
        return;
    }

    const emi = calculateEMI(principal, rate, months);

    result.textContent = "Your Monthly EMI is: ₹" + emi.toFixed(2);
});

// For loop example
let balance = 1000;

for (let month = 1; month <= 3; month++) {
    balance += 100;
}

console.log("Example balance after 3 deposits:", balance);

// While loop example
let count = 1;

while (count <= 2) {
    console.log("Statement month", count);
    count++;
}

// Do-while example
let attempts = 0;

do {
    attempts++;
} while (attempts < 1);

// Var, let and const example
var bankName = "Secure Bank";
let accountType = "Savings";
const currency = "INR";

console.log(bankName, accountType, currency);
