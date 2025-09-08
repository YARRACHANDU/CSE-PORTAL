const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Event = require("../models/Event");

const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  res.json(await Event.find({}, "title description date eventImgUrl"));
});

router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
});

router.post("/", upload.single("eventImg"), async (req, res) => {
  const { title, description, date } = req.body;
  const eventImgUrl = req.file ? "/uploads/" + req.file.filename : "";
  const event = new Event({ title, description, date, eventImgUrl });
  await event.save();
  res.status(201).json(event);
});

router.put("/:id", upload.single("eventImg"), async (req, res) => {
  const updates = req.body;
  if (req.file) updates.eventImgUrl = "/uploads/" + req.file.filename;
  const updated = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Event not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted" });
});

router.post("/:id/gallery", upload.array("gallery"), async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  req.files.forEach((file) =>
    event.gallery.push({ imgUrl: "/uploads/" + file.filename })
  );
  await event.save();
  res.json(event.gallery);
});

router.delete("/:eventId/gallery/:galleryId", async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });
  event.gallery.id(req.params.galleryId).remove();
  await event.save();
  res.json({ message: "Gallery image deleted" });
});

router.post(
  "/:id/certificates",
  upload.array("certificates"),
  async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    req.files.forEach((file) => {
      const baseName = path.parse(file.originalname).name;
      event.certificates.push({
        studentName: baseName,
        certUrl: "/uploads/" + file.filename,
      });
    });
    await event.save();
    res.json(event.certificates);
  }
);

router.delete("/:eventId/certificates/:certId", async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });
  event.certificates.id(req.params.certId).remove();
  await event.save();
  res.json({ message: "Certificate deleted" });
});

router.put("/:eventId/certificates/:certId", async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });
  const cert = event.certificates.id(req.params.certId);
  if (!cert) return res.status(404).json({ message: "Certificate not found" });
  cert.studentName = req.body.studentName || cert.studentName;
  await event.save();
  res.json(cert);
});

module.exports = router;
