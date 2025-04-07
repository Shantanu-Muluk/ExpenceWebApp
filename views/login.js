document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        axios.post("http://localhost:5010/login", data)
        .then(res => {
            console.log("Login Successful", res.data);
            alert(res.data.message || "Login successful!");
            // window.location.href = '/dashboard';
        })
        .catch(err => {
            console.error("Login Failed", err);
            alert(err.response?.data?.message || "Login failed. Please check your credentials.");
        });
    });
});