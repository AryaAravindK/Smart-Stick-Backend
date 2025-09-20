const pool = require("../config/db");

exports.addLocation = async (req, res) => {
  const { device_id, latitude, longitude } = req.body;
  try {
    await pool.query(
      "INSERT INTO location_history (id, device_id, latitude, longitude, created_at) VALUES(UUID(),?,?,?,NOW())",
      [device_id, latitude, longitude]
    );
    res.json({ message: "Location stored successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
