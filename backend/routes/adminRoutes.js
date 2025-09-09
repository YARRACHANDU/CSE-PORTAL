const express = require("express");
const router = express.Router();

const predefinedPassword = "CSE@nriit.edu.in";

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === predefinedPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

module.exports = router;
