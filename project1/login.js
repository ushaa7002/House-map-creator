function login() {

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    let correctEmail = "user@gmail.com";
    let correctPassword = "123456";

    if (email === correctEmail && password === correctPassword) {

       
        sessionStorage.setItem("isLoggedIn", "true");

        // Go to main page
        window.location.href = "house.html";

    } else {

        document.getElementById("message").innerText =
            "Incorrect Email or Password!";
    }
}
