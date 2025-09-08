import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function AdminDashboard({ onLogout }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // State for new event inputs and edits
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [eventImageFile, setEventImageFile] = useState(null);

  // Certificates and gallery uploads
  const [certFiles, setCertFiles] = useState([]);
  const [certNames, setCertNames] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:4000/api/events")
      .then((res) => setEvents(res.data))
      .catch(console.error);
  };

  // Add new event
  const addEvent = () => {
    if (!title || !date) return alert("Title and Date are required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    if (eventImageFile) formData.append("eventImg", eventImageFile);

    axios
      .post("http://localhost:4000/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setTitle("");
        setDescription("");
        setDate("");
        setEventImageFile(null);
        fetchEvents();
        alert("Event added successfully");
      })
      .catch(console.error);
  };

  // Select event with details to edit
  const selectEvent = (event) => {
    setSelectedEvent(event);
    setTitle(event.title || "");
    setDescription(event.description || "");
    setDate(event.date ? event.date.slice(0, 10) : "");
    setCertFiles([]);
    setCertNames([]);
    setGalleryFiles([]);
  };

  // Update event info
  const updateEvent = () => {
    if (!title || !date) return alert("Title and Date are required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    if (eventImageFile) formData.append("eventImg", eventImageFile);

    axios
      .put(`http://localhost:4000/api/events/${selectedEvent._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setSelectedEvent(res.data);
        fetchEvents();
        alert("Event updated successfully");
      })
      .catch(console.error);
  };

  // Delete event
  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;
    axios
      .delete(`http://localhost:4000/api/events/${id}`)
      .then(() => {
        if (selectedEvent && selectedEvent._id === id) setSelectedEvent(null);
        fetchEvents();
      })
      .catch(console.error);
  };

  // Delete certificate
  const deleteCert = (certId) => {
    axios
      .delete(
        `http://localhost:4000/api/events/${selectedEvent._id}/certificates/${certId}`
      )
      .then(() => {
        alert("Certificate deleted");
        reloadSelectedEvent();
      })
      .catch(console.error);
  };

  // Edit certificate student name
  const editCertName = (certId, newName) => {
    axios
      .put(
        `http://localhost:4000/api/events/${selectedEvent._id}/certificates/${certId}`,
        { studentName: newName }
      )
      .then(() => reloadSelectedEvent())
      .catch(console.error);
  };

  // Delete gallery image
  const deleteGalleryImg = (galleryId) => {
    axios
      .delete(
        `http://localhost:4000/api/events/${selectedEvent._id}/gallery/${galleryId}`
      )
      .then(() => {
        alert("Gallery image deleted");
        reloadSelectedEvent();
      })
      .catch(console.error);
  };

  // Refresh selected event details from server
  const reloadSelectedEvent = () => {
    axios
      .get(`http://localhost:4000/api/events/${selectedEvent._id}`)
      .then((res) => setSelectedEvent(res.data))
      .catch(console.error);
  };

  // Upload gallery images
  const uploadGallery = () => {
    if (!selectedEvent) return alert("Select an event first");
    if (galleryFiles.length === 0)
      return alert("Select gallery images to upload");

    const formData = new FormData();
    galleryFiles.forEach((file) => formData.append("gallery", file));

    axios
      .post(
        `http://localhost:4000/api/events/${selectedEvent._id}/gallery`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(() => {
        alert("Gallery images uploaded");
        setGalleryFiles([]);
        reloadSelectedEvent();
      })
      .catch(console.error);
  };

  // Upload certificates
  const uploadCertificates = () => {
    if (!selectedEvent) return alert("Select an event first");
    if (certFiles.length === 0)
      return alert("Select certificate files to upload");
    if (certNames.length !== certFiles.length)
      return alert("Enter all student names");

    const certsData = certNames.map((name, index) => ({
      studentName: name,
      fileIndex: index,
    }));

    const formData = new FormData();
    certFiles.forEach((file) => formData.append("certificates", file));
    formData.append("certsData", JSON.stringify(certsData));

    axios
      .post(
        `http://localhost:4000/api/events/${selectedEvent._id}/certificates`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(() => {
        alert("Certificates uploaded");
        setCertFiles([]);
        setCertNames([]);
        reloadSelectedEvent();
      })
      .catch(console.error);
  };

  // Track student name input change
  const handleCertNameChange = (index, value) => {
    const updated = [...certNames];
    updated[index] = value;
    setCertNames(updated);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Admin Dashboard</h2>
      <button onClick={onLogout} style={{ marginBottom: "1rem" }}>
        Logout
      </button>

      <h3>Add Event</h3>
      <div style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <input
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setEventImageFile(e.target.files[0])}
          style={{ marginRight: "1rem" }}
        />
        <button onClick={addEvent}>Add Event</button>
      </div>

      <h3>Events List</h3>
      <ul>
        {events.map((ev) => (
          <li key={ev._id} style={{ marginBottom: "0.5rem" }}>
            <b
              onClick={() => selectEvent(ev)}
              style={{
                cursor: "pointer",
                color: ev._id === selectedEvent?._id ? "blue" : "black",
                marginRight: "1rem",
              }}
            >
              {ev.title}
            </b>
            <button
              onClick={() => deleteEvent(ev._id)}
              style={{ color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {selectedEvent && (
        <>
          <h3>Edit Event</h3>
          <div style={{ marginBottom: "1rem" }}>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginRight: "1rem" }}
            />
            <input
              placeholder="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ marginRight: "1rem" }}
            />
            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ marginRight: "1rem" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEventImageFile(e.target.files[0])}
              style={{ marginRight: "1rem" }}
            />
            <button onClick={updateEvent}>Update Event</button>
          </div>

          <h3>Upload Gallery Images</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setGalleryFiles([...e.target.files])}
          />
          <button onClick={uploadGallery}>Upload Gallery</button>

          <h3>Upload Certificates</h3>
          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e) => {
              setCertFiles([...e.target.files]);
              setCertNames(Array(e.target.files.length).fill(""));
            }}
          />
          {certFiles.map((file, idx) => (
            <input
              key={idx}
              placeholder={`Student Name for ${file.name}`}
              value={certNames[idx] || ""}
              onChange={(e) => handleCertNameChange(idx, e.target.value)}
              style={{ display: "block", marginTop: "0.5rem" }}
            />
          ))}
          <button onClick={uploadCertificates}>Upload Certificates</button>

          <h3>Certificates</h3>
          <ul>
            {(selectedEvent.certificates || []).map((cert) => (
              <li key={cert._id} style={{ marginBottom: "0.5rem" }}>
                <input
                  type="text"
                  value={cert.studentName}
                  onChange={(e) => editCertName(cert._id, e.target.value)}
                  style={{ marginRight: "1rem" }}
                />
                <button onClick={() => deleteCert(cert._id)}>Delete</button>
              </li>
            ))}
          </ul>

          <h3>Gallery Images</h3>
          <ul>
            {(selectedEvent.gallery || []).map((img) => (
              <li key={img._id} style={{ marginBottom: "0.5rem" }}>
                <img
                  src={`http://localhost:4000${img.imgUrl}`}
                  alt=""
                  width={80}
                  style={{ marginRight: "1rem" }}
                />
                <button onClick={() => deleteGalleryImg(img._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
