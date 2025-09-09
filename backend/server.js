const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.mongourl)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log("Server running on port 4000"));
  })
  .catch(console.error);
