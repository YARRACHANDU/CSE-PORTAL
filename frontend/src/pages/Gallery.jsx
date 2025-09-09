import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";

export default function Gallery({ eventId }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/events/${eventId}`
        );
        setGallery(response.data.gallery || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [eventId]);

  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const downloadImage = (img) => {
    const fileUrl = `http://localhost:4000${img.imgUrl}`;
    let extension = fileUrl.substring(fileUrl.lastIndexOf("."));
    if (!extension || extension.length > 5) extension = ".jpg";
    const fileName = `gallery-image-${img._id}${extension}`;
    downloadFile(fileUrl, fileName);
  };

  const openModal = (idx) => {
    setCurrentIdx(idx);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((currentIdx - 1 + gallery.length) % gallery.length);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((currentIdx + 1) % gallery.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  if (!gallery.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 max-w-md mx-auto">
          There are currently no gallery images available for this event.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Event Gallery</h2>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
          <Download className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {gallery.length} Images
          </span>
        </div>
      </div>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((img, idx) => (
          <div
            key={img._id}
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm bg-gray-50"
          >
            <img
              src={`http://localhost:4000${img.imgUrl}`}
              alt={`Gallery Image ${idx + 1}`}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onClick={() => openModal(idx)}
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(idx);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                title="View Image"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(img);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                title="Download Image"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            aria-label="Close gallery modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {/* Prev/Next Navigation */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
          {/* Image Display */}
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <img
              src={`http://localhost:4000${gallery[currentIdx].imgUrl}`}
              alt={`Gallery Image ${currentIdx + 1}`}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Image Info and Download */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex items-center justify-between">
              <span className="text-white text-sm">
                Image {currentIdx + 1} of {gallery.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(gallery[currentIdx]);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-white" />
                <span className="text-white">Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
