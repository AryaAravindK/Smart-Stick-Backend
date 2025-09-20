const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM account WHERE email=?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO account (account_id,email,password,is_verified,is_admin,created_at) VALUES(UUID(),?,?,0,0,NOW())",
      [email, hashed]);

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM account WHERE email=?", [email]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ account_id: user.account_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.test = async (req,res) =>{
  res.json({"message":"API working!!"});
}