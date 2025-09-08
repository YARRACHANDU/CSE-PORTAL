import React, { useState, useEffect } from "react";
import axios from "axios";
import CertificateCard from "../components/CertificateCard";

export default function Certificates({ eventId }) {
  const [certificates, setCertificates] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/events/${eventId}`)
      .then((res) => setCertificates(res.data.certificates || []));
  }, [eventId]);

  if (!certificates.length) return <p>No certificates found.</p>;

  const openModal = (idx) => {
    setCurrentIdx(idx);
    setGalleryOpen(true);
  };

  const closeModal = () => setGalleryOpen(false);

  const prevCert = (e) => {
    e.stopPropagation();
    setCurrentIdx((currentIdx - 1 + certificates.length) % certificates.length);
  };

  const nextCert = (e) => {
    e.stopPropagation();
    setCurrentIdx((currentIdx + 1) % certificates.length);
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {certificates.map((cert, idx) => (
          <CertificateCard
            key={cert._id}
            cert={cert}
            onView={() => openModal(idx)}
          />
        ))}
      </div>

      {galleryOpen && (
        <div className="modal" onClick={closeModal}>
          <button
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              fontSize: "2rem",
              color: "white",
            }}
            onClick={prevCert}
          >
            ‹
          </button>
          <img
            src={`http://localhost:4000${certificates[currentIdx].certUrl}`}
            alt={certificates[currentIdx].studentName}
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              fontSize: "2rem",
              color: "white",
            }}
            onClick={nextCert}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
