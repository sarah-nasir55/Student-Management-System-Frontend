import React, { useState, useEffect } from "react";
import { GridLayout } from "react-grid-layout";
import { useStudents } from "../../hooks/useStudents";
import { useCourses } from "../../hooks/useCourses";
import { useSemesters } from "../../hooks/useSemesters";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setLandingPageLayout } from "../../redux/layoutSlice";
import { authAPI } from "../../services/api";

const testimonials = {
  name: "Dr. Ahmed Hassan",
  position: "Dean of Academic Affairs",
  text: "Our Student Management System has revolutionized how we manage academic operations. The intuitive interface and comprehensive features make it an invaluable tool for our institution.",
};

const upcomingEvents = [
  {
    id: 1,
    title: "Spring Semester Registration",
    date: "2026-02-01",
    link: "#",
  },
  { id: 2, title: "Annual Sports Day", date: "2026-03-15", link: "#" },
  {
    id: 3,
    title: "Guest Lecture - AI in Education",
    date: "2026-02-20",
    link: "#",
  },
];

const pastEvents = [
  { id: 1, title: "Fall Semester Commencement", date: "2025-12-20" },
  { id: 2, title: "Mid-Semester Exams", date: "2025-11-10" },
  { id: 3, title: "Welcome Freshmen Orientation", date: "2025-08-15" },
  { id: 4, title: "Faculty Development Workshop", date: "2025-07-22" },
];

const LandingPage = () => {
  const { data: students } = useStudents();
  const { data: courses } = useCourses();
  const { data: semesters } = useSemesters();

  const [isClient, setIsClient] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(null);

  const layout = useSelector((state) => state.layout.landingPageLayout);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleLayoutChange = (newLayout) => {
    const cleanedLayout = newLayout.map(({ i, x, y, w, h }) => ({
      i,
      x,
      y,
      w,
      h,
    }));

    dispatch(setLandingPageLayout(cleanedLayout));

    // Debounced save
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeoutId = setTimeout(() => saveLayoutToBackend(cleanedLayout), 500);
    setSaveTimeout(timeoutId);
  };

  const saveLayoutToBackend = async (layoutData) => {
    if (!user || !user.email) return;

    try {
      const layoutString = JSON.stringify({ landingPageLayout: layoutData });
      await authAPI.saveLayout(user.email, layoutString);
    } catch (error) {
      console.error("Failed to save layout:", error);
    }
  };

  return (
    <div>
      <div>
        <GridLayout
          className="w-full"
          layout={layout ?? []}
          onLayoutChange={handleLayoutChange}
          cols={12}
          rowHeight={4}
          width={1270}
          preventCollision={true}
          isDraggable={true}
          isResizable={true}
          compactType={null}
        >
          {/* Hero Section */}
          <div
            key="hero"
            className="flex flex-col items-center justify-center rounded-xl p-12 md:p-4 text-white text-center shadow-md hover:shadow-lg transition-all duration-300 bg-cover bg-center"
            style={{
              backgroundImage: "url('/heroSection.png.jpg')",
            }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Welcome to Student Management System
            </h1>
            <p className="text-lg md:text-xl opacity-95 leading-relaxed max-w-3xl font-light">
              Streamline your academic operations with our comprehensive student
              management platform. Manage students, courses, semesters, and
              enrollments all in one place.
            </p>
          </div>

          {/* Stats Cards */}
          <div
            key="students-card"
            className="bg-orange-100 rounded-xl px-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-indigo-600 flex items-center gap-6"
          >
            <div className="bg-blue-300 rounded-lg p-6 text-4xl flex-shrink-0">
              👥
            </div>
            <div className="flex-1">
              <h3 className="text-gray-600 font-medium text-sm tracking-wide">
                Total Students
              </h3>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {students?.length || 0}
              </p>
            </div>
          </div>

          <div
            key="semesters-card"
            className="bg-green-100 rounded-xl px-4 py-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-purple-600 flex items-start gap-6"
          >
            <div className="bg-purple-300 rounded-lg p-4 text-3xl flex-shrink-0">
              📅
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-700 font-semibold text-sm tracking-wide">
                  Semesters
                </h3>
                <span className="font-bold rounded-full w-7 h-7 flex items-center justify-center bg-purple-300 text-sm">
                  {semesters?.length || 0}
                </span>
              </div>

              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 max-h-24 overflow-y-auto pr-1">
                {semesters?.map((s) => (
                  <li key={s.id}>{s.semester}</li>
                ))}
              </ul>
            </div>
          </div>

          <div
            key="courses-card"
            className="bg-yellow-100 rounded-xl px-4 py-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-green-600 flex items-start gap-6"
          >
            <div className="bg-green-300 rounded-lg p-4 text-3xl flex-shrink-0">
              📚
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-700 font-semibold text-sm tracking-wide">
                  Courses
                </h3>
                <span className="font-bold rounded-full w-7 h-7 flex items-center justify-center bg-green-300 text-sm">
                  {courses?.length || 0}
                </span>
              </div>

              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 max-h-24 overflow-y-auto pr-1">
                {courses?.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Testimonials Card */}
          <div
            key="testimonials-card"
            className="bg-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-indigo-600"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Dean's Testimonial
              </h3>
              <span className="text-4xl text-indigo-600 opacity-20">"</span>
            </div>
            <p className="text-gray-700 italic leading-relaxed mb-6">
              {testimonials.text}
            </p>
            <div className="pt-6 border-t border-gray-200">
              <p className="font-semibold text-gray-900">{testimonials.name}</p>
              <p className="text-gray-500 text-sm">{testimonials.position}</p>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div
            key="upcoming-events-card"
            className="bg-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-r-4 border-purple-700"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Upcoming Events
              </h3>
              <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                New
              </span>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center py-3 px-2 border-b border-gray-100 hover:bg-gray-50 rounded transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {event.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">
                      📆 {event.date}
                    </p>
                  </div>
                  <a
                    href={event.link}
                    className="text-indigo-600 font-bold text-lg hover:text-purple-700 hover:translate-x-1 transition-all pl-2"
                  >
                    →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Past Events Card */}
          <div
            key="past-events-card"
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-gray-400 col-span-12"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Past Events</h3>
              <span className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Archived
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-1 bg-gradient-to-b from-indigo-600 to-purple-700 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {event.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-2">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GridLayout>
      </div>
    </div>
  );
};

export default LandingPage;
