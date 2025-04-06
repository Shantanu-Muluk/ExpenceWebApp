const express = require("express");
const app = express();
const body_parser = require("body-parser");
const port = 5010;
const routes = require("./routes/userRoute");
const cors = require("cors");

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("views"));

app.use("/",routes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});