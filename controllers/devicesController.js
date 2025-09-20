const pool = require("../config/db");

exports.addDevice = async (req, res) => {
  const { device_name, device_type } = req.body;
  try {
    await pool.query(
      "INSERT INTO devices (device_id, account_id, device_name, device_type, registered_at) VALUES(UUID(),?,?,?,NOW())",
      [req.user.account_id, device_name, device_type]
    );
    res.json({ message: "Device added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
