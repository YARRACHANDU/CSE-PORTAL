import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function CertificateCard({ cert, onView }) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const imgUrl = `http://localhost:4000${cert.certUrl}`;

  function downloadAs(format) {
    if (format === "jpg") {
      fetch(imgUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${cert.studentName}_certificate.jpg`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        });
    } else if (format === "pdf") {
      const doc = new jsPDF();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const imgProps = doc.getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        doc.save(`${cert.studentName}_certificate.pdf`);
      };
      img.src = imgUrl;
    }
    setShowDownloadMenu(false);
  }

  return (
    <div className="cert-card">
      <img
        src={imgUrl}
        alt={`Certificate of ${cert.studentName}`}
        style={{ width: "100%", cursor: "pointer" }}
        onClick={onView}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <b>{cert.studentName}</b>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            title="Download options"
          >
            ⬇️
          </button>
          {showDownloadMenu && (
            <div className="download-menu">
              <button onClick={() => downloadAs("jpg")}>Download JPG</button>
              <button onClick={() => downloadAs("pdf")}>Download PDF</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
