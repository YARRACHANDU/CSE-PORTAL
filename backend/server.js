const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect("mongodb://localhost:27017/cse-events", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch(console.error);
