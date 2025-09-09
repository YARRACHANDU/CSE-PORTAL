import React, { useEffect, useState } from "react";
import {
  Calendar,
  Upload,
  Edit3,
  Trash2,
  Plus,
  Image,
  Award,
  Save,
  LogOut,
} from "lucide-react";

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

  // UI State
  const [activeSection, setActiveSection] = useState("events");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new event
  const addEvent = async () => {
    if (!title || !date) return alert("Title and Date are required");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    if (eventImageFile) formData.append("eventImg", eventImageFile);

    try {
      const response = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setDate("");
        setEventImageFile(null);
        fetchEvents();
        alert("Event added successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
    setActiveSection("edit");
  };

  // Update event info
  const updateEvent = async () => {
    if (!title || !date) return alert("Title and Date are required");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    if (eventImageFile) formData.append("eventImg", eventImageFile);

    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${selectedEvent._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedEvent(data);
        fetchEvents();
        alert("Event updated successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (selectedEvent && selectedEvent._id === id) setSelectedEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete certificate
  const deleteCert = async (certId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${selectedEvent._id}/certificates/${certId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Certificate deleted");
        reloadSelectedEvent();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Edit certificate student name
  const editCertName = async (certId, newName) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${selectedEvent._id}/certificates/${certId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentName: newName }),
        }
      );

      if (response.ok) {
        reloadSelectedEvent();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete gallery image
  const deleteGalleryImg = async (galleryId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${selectedEvent._id}/gallery/${galleryId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Gallery image deleted");
        reloadSelectedEvent();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Refresh selected event details from server
  const reloadSelectedEvent = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${selectedEvent._id}`
      );
      const data = await response.json();
      setSelectedEvent(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Upload gallery images
  const uploadGallery = async () => {
    if (!selectedEvent) return alert("Select an event first");
    if (galleryFiles.length === 0)
      return alert("Select gallery images to upload");

    setIsLoading(true);
    const formData = new FormData();
    galleryFiles.forEach((file) => formData.append("gallery", file));

    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${selectedEvent._id}/gallery`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Gallery images uploaded");
        setGalleryFiles([]);
        reloadSelectedEvent();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload certificates
  const uploadCertificates = async () => {
    if (!selectedEvent) return alert("Select an event first");
    if (certFiles.length === 0)
      return alert("Select certificate files to upload");
    if (certNames.length !== certFiles.length)
      return alert("Enter all student names");

    setIsLoading(true);
    const certsData = certNames.map((name, index) => ({
      studentName: name,
      fileIndex: index,
    }));

    const formData = new FormData();
    certFiles.forEach((file) => formData.append("certificates", file));
    formData.append("certsData", JSON.stringify(certsData));

    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${selectedEvent._id}/certificates`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Certificates uploaded");
        setCertFiles([]);
        setCertNames([]);
        reloadSelectedEvent();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Track student name input change
  const handleCertNameChange = (index, value) => {
    const updated = [...certNames];
    updated[index] = value;
    setCertNames(updated);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                College Events Admin
              </h1>
            </div>

            <div className="flex space-x-2">
              {/* New button beside Logout */}
              <button
                onClick={() =>
                  (window.location.href = "/your-desired-page-path")
                }
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <span>Open Page</span>
              </button>

              {/* Existing Logout button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-md p-1 mb-8">
          <button
            onClick={() => setActiveSection("events")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeSection === "events"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Events</span>
          </button>
          {selectedEvent && (
            <button
              onClick={() => setActiveSection("edit")}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === "edit"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Event</span>
            </button>
          )}
        </div>

        {/* Events Section */}
        {activeSection === "events" && (
          <div className="space-y-8">
            {/* Add Event Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Event
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Event description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventImageFile(e.target.files[0])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={addEvent}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>{isLoading ? "Adding..." : "Add Event"}</span>
              </button>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Events List
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage all your college events
                </p>
              </div>

              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No events found. Add your first event above!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {events.map((ev) => (
                    <div
                      key={ev._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {ev.eventImg ? (
                                <img
                                  src={`http://localhost:4000${ev.eventImg}`}
                                  alt={ev.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3
                                onClick={() => selectEvent(ev)}
                                className={`text-lg font-medium cursor-pointer transition-colors ${
                                  ev._id === selectedEvent?._id
                                    ? "text-blue-600"
                                    : "text-gray-800 hover:text-blue-600"
                                }`}
                              >
                                {ev.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {ev.date && formatDate(ev.date)} •{" "}
                                {ev.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => selectEvent(ev)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEvent(ev._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Event Section */}
        {activeSection === "edit" && selectedEvent && (
          <div className="space-y-8">
            {/* Edit Event Details */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Event: {selectedEvent.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Event description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventImageFile(e.target.files[0])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={updateEvent}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Updating..." : "Update Event"}</span>
              </button>
            </div>

            {/* Gallery Upload */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Gallery Images
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setGalleryFiles([...e.target.files])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {galleryFiles.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {galleryFiles.length} files selected
                    </p>
                  )}
                </div>
                <button
                  onClick={uploadGallery}
                  disabled={isLoading || galleryFiles.length === 0}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isLoading ? "Uploading..." : "Upload Gallery"}</span>
                </button>
              </div>

              {/* Gallery Images Grid */}
              {selectedEvent.gallery && selectedEvent.gallery.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Current Gallery Images
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedEvent.gallery.map((img) => (
                      <div key={img._id} className="relative group">
                        <img
                          src={`http://localhost:4000${img.imgUrl}`}
                          alt=""
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => deleteGalleryImg(img._id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Certificates Upload */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Certificates
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Certificate Files
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) => {
                      setCertFiles([...e.target.files]);
                      setCertNames(Array(e.target.files.length).fill(""));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {certFiles.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Student Names
                    </label>
                    {certFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <span
                          className="text-sm text-gray-600 w-32 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        <input
                          type="text"
                          placeholder="Enter student name"
                          value={certNames[idx] || ""}
                          onChange={(e) =>
                            handleCertNameChange(idx, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={uploadCertificates}
                  disabled={isLoading || certFiles.length === 0}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    {isLoading ? "Uploading..." : "Upload Certificates"}
                  </span>
                </button>
              </div>

              {/* Certificates List */}
              {selectedEvent.certificates &&
                selectedEvent.certificates.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      Current Certificates
                    </h4>
                    <div className="space-y-3">
                      {selectedEvent.certificates.map((cert) => (
                        <div
                          key={cert._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Award className="w-5 h-5 text-purple-600" />
                            <input
                              type="text"
                              value={cert.studentName}
                              onChange={(e) =>
                                editCertName(cert._id, e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <button
                            onClick={() => deleteCert(cert._id)}
                            className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
