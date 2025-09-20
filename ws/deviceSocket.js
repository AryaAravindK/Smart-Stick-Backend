// ws/deviceSocket.js
const { WebSocketServer } = require("ws");
const db = require("../config/db"); // assume you have a db.js for pool connection

// --- Mock ML Model ---
function runMockMLModel(image, distance) {
  return `Object detected at ${distance}cm, confidence ${(Math.random() * 100).toFixed(2)}%`;
}

function initDeviceSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("📡 Device connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const { device_id, input_image, distance } = data;

        console.log("📥 Received:", data);

        // Run ML Model
        const modelResponse = runMockMLModel(input_image, distance);

        // Save to DB
        await db.query(
          "INSERT INTO device_data (device_id, input_image, distance, model_response) VALUES (?, ?, ?, ?)",
          [device_id, input_image, distance, modelResponse]
        );

        // Send response back
        ws.send(JSON.stringify({ status: "ok", model_response: modelResponse }));
        console.log("📤 Sent:", modelResponse);
      } catch (err) {
        console.error("❌ Error:", err.message);
        ws.send(JSON.stringify({ status: "error", message: err.message }));
      }
    });

    ws.on("close", () => {
      console.log("🔌 Device disconnected");
    });
  });

  return wss;
}

module.exports = initDeviceSocket;
