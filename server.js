require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true })); // Add this line
app.use(bodyParser.json());
app.use(require("cors")());

// app.use(express.json()); // Keep this line

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "bmx-new",
});
console.log(process.env.DB_USER);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// Get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add a new user
app.post("/users", (req, res) => {
  console.log(req.body);
  const { CURP, birthday,city,experience, gender,name } = req.body;
//   console.log(req.body)
  // experience debe ser validado
  // como null, ya que si solo se
  // evalua como !experience, simplemente
  // dará error porque su valor por defecto
  // es 0, y 0 es igual a !experience
  if (!CURP || !name || !birthday || !gender || experience==null || !city) {
    console.log("falla");
    return res.status(400).json({ error: "All fields are required" });
  }

  // const sql = "INSERT INTO user (CURP, name, birthday, gender) VALUES (?, ?, ?, ?)";
  //RegisterUser(CURP,name,birthday,gender,years_compiting,city)
  const sql = "CALL RegisterUser(?,?,?,?,?,?)";
  db.query(sql, [CURP, name, birthday, gender,experience,city], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "User added successfully" });
  });
});

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
