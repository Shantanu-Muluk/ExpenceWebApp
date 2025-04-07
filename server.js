const express = require("express");
const app = express();
const body_parser = require("body-parser");
const port = 5010;
const routes = require("./routes/userRoute");
const cors = require("cors");
const path = require('path'); // Make sure 'path' is imported

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("views"));

// Serve the signup page at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); // Serving signup
});

// Serve the expense tracker page
app.get('/expenses', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-expence.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve the signup page at /signup as well (for the link from login)
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); // Serving signup
});

app.use("/", routes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});