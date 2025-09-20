const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:2424");

ws.on("open", () => {
  console.log("✅ Connected to WS");

    ws.send(JSON.stringify({
      device_id: 1,
      input_image: "base64EncodedImageHere",
      distance: 123.45
    }));
});

ws.on("message", (msg) => {
  console.log("📥 From Server:", msg.toString());
});
