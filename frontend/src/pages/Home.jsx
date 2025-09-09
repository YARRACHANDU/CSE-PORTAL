import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Clock,
  ArrowRight,
  Image,
} from "lucide-react";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your exact original API call - unchanged
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => {
    // This will work with your Link component
    window.location.href = `/events/${eventId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header with College Logo */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* College Logo Corner */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Computer Science And Engineering
                </h1>
                <p className="text-sm text-gray-600">Events & Gallery</p>
              </div>
            </div>

            {/* Navigation */}
            <nav>
              <a
                href="/admin/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Admin
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                College Events
              </h2>
              <p className="text-gray-600">
                Discover our latest events and achievements
              </p>
            </div>
            {!loading && (
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {events.length} Events
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((e) => (
              <article
                key={e._id}
                onClick={() => handleEventClick(e._id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 group overflow-hidden"
              >
                {/* Event Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {e.eventImgUrl ? (
                    <img
                      src={`http://localhost:4000${e.eventImgUrl}`}
                      alt={e.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      e.eventImgUrl ? "hidden" : "flex"
                    }`}
                  >
                    <div className="text-center">
                      <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Event Image</p>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>

                  {/* Date Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                      <p className="text-xs font-semibold text-gray-800">
                        {new Date(e.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {e.title}
                    </h3>

                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <time dateTime={e.date}>
                        {new Date(e.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-500 font-medium">
                        Available
                      </span>
                    </div>
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are currently no events available. Check back later for
              updates.
            </p>
          </div>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* College Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  CSE Events Portal
                </h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your gateway to college events, achievements, and certificates.
                Stay updated with the latest activities and opportunities.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Quick Links</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    All Events
                  </a>
                </li>

                <li>
                  <a
                    href="/admin/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Admin
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Get in Touch</h5>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Fri, 9:20AM-PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Computer Science and Engineering</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} College Events Portal. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
