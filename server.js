const express = require("express");
require("dotenv").config();
const http = require("http");

const authRoutes = require("./routes/auth");
const deviceRoutes = require("./routes/devices");
const locationRoutes = require("./routes/location");
const initDeviceSocket = require("./ws/deviceSocket");
const sosRoutes = require('./routes/sos');

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/location", locationRoutes);
app.use('/api/sos', sosRoutes);

const server = http.createServer(app);
initDeviceSocket(server);

const PORT = process.env.PORT || 2424;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);