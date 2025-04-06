document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        axios.post("http://localhost:5010/adduser", data) 
            .then(res => {
                console.log("User Added Successfully", res.data);
                alert(res.data.message || "Sign up successful!"); 
                event.target.reset();
            })
            .catch(err => {
                console.error("Error while adding user", err);
                alert(err.response?.data?.message || "Sign up failed. Please try again."); 
            });
    });
});