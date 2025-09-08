import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Gallery({ eventId }) {
  const [gallery, setGallery] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/events/${eventId}`)
      .then((res) => setGallery(res.data.gallery || []));
  }, [eventId]);

  if (gallery.length === 0) return <p>No gallery images.</p>;

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex - 1 + gallery.length) % gallery.length);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex + 1) % gallery.length);
  };

  return (
    <div>
      <div className="gallery-grid">
        {gallery.map((img, idx) => (
          <img
            key={img._id}
            src={`http://localhost:4000${img.imgUrl}`}
            alt={`Gallery Image ${idx + 1}`}
            onClick={() => openModal(idx)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <button className="prev-btn" onClick={showPrev}>
            ◀
          </button>
          <img
            src={`http://localhost:4000${gallery[currentIndex].imgUrl}`}
            alt={`Gallery Image ${currentIndex + 1}`}
          />
          <button className="next-btn" onClick={showNext}>
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
