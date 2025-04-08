const database = require("../database/database")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwt_key = "expense";

const addUSer = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedP = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)`;
        await database.query(query, [username, hashedP, email]);

        console.log("Data inserted Successfully");

        res.json({ message: "Data inserted successfully", data: req.body });
    } catch (error) {
        console.log("❌ Error while adding the user", error);
        res.status(500).json({ message: "Database insert error", error: error.message });
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide the requested information" })
    }

    try {
        const [rows] = await database.execute("select * from users where Email = ?", [email]);
        const user = rows[0]

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.Password)

        if (passwordMatch) {
            const payload = {
                userId: user.UserID,
                username: user.Username,
                email: user.Email
            }

            const token = jwt.sign(payload,jwt_key, {expiresIn: "5min"})

            console.log("✅ Login successful");
            res.json({ message: "Login successful!", token: token, user: { id: user.UserID, username: user.Username, email: user.Email } });
        } else {
            console.log("❌ Incorrect password");
            res.status(401).json({ message: "Invalid email or password." });
        }
    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ message: "Login failed due to a server error." });
    }
}

module.exports = { addUSer, handleLogin }