const form=document.getElementById("patientForm");
const message=document.getElementById("message");
form.addEventListener("submit",function(event){
 event.preventDefault();
 const name=document.getElementById("name").value.trim();
 const email=document.getElementById("email").value.trim();
 const mobile=document.getElementById("mobile").value.trim();
 const password=document.getElementById("password").value;
 const confirm=document.getElementById("confirm").value;
 const namePattern=/^[A-Za-z ]{2,50}$/;
 const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 const mobilePattern=/^[6-9]\d{9}$/;
 if(!namePattern.test(name)){show("Enter a valid name using letters only.");return;}
 if(!emailPattern.test(email)){show("Enter a valid email address.");return;}
 if(!mobilePattern.test(mobile)){show("Enter a valid 10-digit Indian mobile number.");return;}
 if(password.length<8||!/[A-Z]/.test(password)||!/[a-z]/.test(password)||!/[0-9]/.test(password)){show("Password must have 8 characters, upper/lowercase letters and a number.");return;}
 if(password!==confirm){show("Passwords do not match.");return;}
 if(!form.checkValidity()){show("Please complete all required fields.");return;}
 message.className="success";message.textContent="Registration form validated successfully. (Demo only; no data was sent.)";
});
function show(text){message.className="error";message.textContent=text;}
