import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Award,
  Eye,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
} from "lucide-react";

export default function Certificates({ eventId, searchTerm }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/events/${eventId}`
        );
        setCertificates(response.data.certificates || []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [eventId]);

  const filteredCertificates = certificates.filter((cert) =>
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const downloadImage = (cert) => {
    const fileUrl = `http://localhost:4000${cert.certUrl}`;
    let extension = fileUrl.substring(fileUrl.lastIndexOf("."));
    if (!extension || extension.length > 5) extension = ".jpg";
    const fileName = `${cert.studentName}-certificate${extension}`;
    downloadFile(fileUrl, fileName);
  };

  const downloadPdf = (cert) => {
    const fileUrl = cert.pdfUrl
      ? `http://localhost:4000${cert.pdfUrl}`
      : `http://localhost:4000${cert.certUrl}`;
    const fileName = `${cert.studentName}-certificate.pdf`;
    downloadFile(fileUrl, fileName);
  };

  const openModal = (idx) => {
    setCurrentIdx(idx);
    setGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setGalleryOpen(false);
    document.body.style.overflow = "unset";
  };

  const prevCert = (e) => {
    e.stopPropagation();
    setCurrentIdx(
      (currentIdx - 1 + filteredCertificates.length) %
        filteredCertificates.length
    );
  };

  const nextCert = (e) => {
    e.stopPropagation();
    setCurrentIdx((currentIdx + 1) % filteredCertificates.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (!filteredCertificates.length) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Award className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Certificates Found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          No certificates match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCertificates.map((cert, idx) => (
          <div
            key={cert._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden group"
          >
            {/* Certificate Preview */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={`http://localhost:4000${cert.certUrl}`}
                alt={`Certificate for ${cert.studentName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="absolute inset-0 hidden items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Certificate</p>
                </div>
              </div>
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-3">
                  <button
                    onClick={() => openModal(idx)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                    title="View Certificate"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => downloadImage(cert)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                    title="Download Certificate Image"
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => downloadPdf(cert)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                    title="Download Certificate PDF"
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 2h7l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM13 3.5V8h4.5L13 3.5zM8 15h2v4H8v-4zM12 10h2v9h-2v-9z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900 truncate">
                    {cert.studentName}
                  </h3>
                </div>

                {cert.issuedDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(cert.issuedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openModal(idx)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => downloadImage(cert)}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      Download Image
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => downloadPdf(cert)}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Modal Gallery code remains unchanged */}
        {/* Modal Gallery */}
        {galleryOpen && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              aria-label="Close certificate modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Arrows */}
            {filteredCertificates.length > 1 && (
              <>
                <button
                  onClick={prevCert}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextCert}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  aria-label="Next certificate"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Certificate Image */}
            <div className="relative max-w-5xl max-h-[90vh] w-full">
              <img
                src={`http://localhost:4000${filteredCertificates[currentIdx].certUrl}`}
                alt={filteredCertificates[currentIdx].studentName}
                className="w-full h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-1">
                    {filteredCertificates[currentIdx].studentName}
                  </h3>
                  {filteredCertificates[currentIdx].issuedDate && (
                    <p className="text-sm text-gray-300">
                      Issued on{" "}
                      {new Date(
                        filteredCertificates[currentIdx].issuedDate
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-300">
                      Certificate {currentIdx + 1} of{" "}
                      {filteredCertificates.length}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          downloadImage(filteredCertificates[currentIdx])
                        }
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Image</span>
                      </button>
                      <button
                        onClick={() =>
                          downloadPdf(filteredCertificates[currentIdx])
                        }
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 2h7l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM13 3.5V8h4.5L13 3.5zM8 15h2v4H8v-4zM12 10h2v9h-2v-9z" />
                        </svg>
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
