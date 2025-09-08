import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/events")
      .then((res) => setEvents(res.data));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {events.map((e) => (
        <Link
          to={`/events/${e._id}`}
          key={e._id}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "250px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
          }}
        >
          {e.eventImgUrl ? (
            <img
              src={`http://localhost:4000${e.eventImgUrl}`}
              alt={e.title}
              style={{
                width: "100%",
                borderRadius: "5px",
                height: "150px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "150px",
                backgroundColor: "#ddd",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
              }}
            >
              No Image
            </div>
          )}
          <h3>{e.title}</h3>
          <p>{new Date(e.date).toLocaleDateString()}</p>
        </Link>
      ))}
    </div>
  );
}
