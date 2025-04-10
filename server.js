const express = require("express");
const app = express();
const body_parser = require("body-parser");
const port = 5010;
const routes = require("./routes/userRoute");
const cors = require("cors");
const path = require('path'); 

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("views"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); 
});

app.get('/expenses', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-expence.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); 
});

app.use("/", routes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});