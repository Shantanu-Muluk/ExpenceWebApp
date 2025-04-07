const database = require("../database/database");

const addUSer = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const query = `INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)`;
        await database.query(query, [username, password, email]);

        console.log("✅ Data inserted Successfully");
        res.json({ message: "Data inserted Successfully", data: req.body });
    } catch (error) {
        console.log("Error while adding the user", error);
        res.status(500).json({ message: "Database insert error", error: error.message });
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password." });
    }

    try {
        const [rows] = await database.execute("SELECT * FROM users WHERE Email = ?", [email]);
        const user = rows[0];

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        if (user.Password === password) {
            console.log("Login successful");
            res.json({ message: "Login successful!", user: { id: user.UserID, username: user.Username, email: user.Email } });
        } else {
            console.log("Incorrect password");
            res.status(401).json({ message: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Login failed due to a server error." });
    }
};

module.exports = { addUSer, handleLogin };
