import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink, Routes, Route, Navigate } from "react-router-dom";
import Certificates from "./Certificates";
import Gallery from "./Gallery";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/events/${id}`)
      .then((res) => setEvent(res.data));
  }, [id]);

  if (!event) return <div>Loading event...</div>;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      {event.eventImgUrl && (
        <img
          src={`http://localhost:4000${event.eventImgUrl}`}
          alt="Event"
          width={200}
        />
      )}
      <nav>
        <NavLink to="" end>
          Certificates
        </NavLink>
        {" | "}
        <NavLink to="gallery">Gallery</NavLink>
      </nav>
      <Routes>
        <Route path="" element={<Certificates eventId={id} />} />
        <Route path="gallery" element={<Gallery eventId={id} />} />
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </div>
  );
}
