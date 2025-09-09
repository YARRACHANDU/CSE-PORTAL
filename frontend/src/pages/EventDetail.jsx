import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useParams,
  NavLink,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import {
  Calendar,
  MapPin,
  Award,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import Certificates from "./Certificates";
import Gallery from "./Gallery";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/events/${id}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600">
            The requested event could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <a href="/">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </a>
            </button>
            <div>
              <p className="text-sm text-gray-600">
                <a href="/">Back to Events</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Image */}
            <div className="lg:col-span-1">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {event.eventImgUrl ? (
                  <img
                    src={`http://localhost:4000${event.eventImgUrl}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    event.eventImgUrl ? "hidden" : "flex"
                  }`}
                >
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Event Image</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {event.title}
                    </h1>
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Active</span>
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs with absolute paths */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 justify-center">
            <NavLink
              to={`/events/${id}`}
              end
              className={({ isActive }) =>
                `py-4 px-2 border-b-2 font-semibold text-lg transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-400"
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Certificates</span>
              </div>
            </NavLink>

            <NavLink
              to={`/events/${id}/gallery`}
              className={({ isActive }) =>
                `py-4 px-2 border-b-2 font-semibold text-lg transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-400"
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Gallery</span>
              </div>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route
            path=""
            element={
              <>
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
                  Certificates
                </h2>

                <div className="flex justify-center mb-6">
                  <input
                    type="text"
                    placeholder="Search by student name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md w-full px-4 py-2 border rounded-lg border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <Certificates eventId={id} searchTerm={searchTerm} />
              </>
            }
          />

          <Route
            path="gallery"
            element={
              <>
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
                  Gallery
                </h2>
                <Gallery eventId={id} />
              </>
            }
          />

          <Route path="*" element={<Navigate to={`/events/${id}`} />} />
        </Routes>
      </div>
    </div>
  );
}
