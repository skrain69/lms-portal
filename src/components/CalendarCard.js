import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../styles/CalendarCard.css";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { format, isSameDay, isToday } from "date-fns";

const CalendarCard = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventsByDate, setEventsByDate] = useState({});
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userId) return;
      const q = query(collection(db, "calendarEvents"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const fetched = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.date && data.title) {
          fetched.push({ id: doc.id, ...data });
        }
      });

      setEvents(fetched);

      const grouped = {};
      fetched.forEach((e) => {
        const key = e.date;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(e);
      });

      setEventsByDate(grouped);
    };

    fetchEvents();
  }, [userId]);

  const selectedDateEvents = events.filter((event) =>
    isSameDay(new Date(event.date), date)
  );

  const handleAddOrUpdate = async () => {
    const dateKey = format(date, "yyyy-MM-dd");
    if (!newEvent.title.trim()) return alert("Title is required.");

    try {
      if (editingId) {
        await updateDoc(doc(db, "calendarEvents", editingId), {
          ...newEvent,
          date: dateKey,
        });
      } else {
        await addDoc(collection(db, "calendarEvents"), {
          ...newEvent,
          date: dateKey,
          userId,
        });
      }

      setNewEvent({ title: "", description: "" });
      setEditingId(null);
      window.location.reload();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setNewEvent({ title: event.title, description: event.description || "" });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "calendarEvents", id));
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const tileContent = ({ date, view }) => {
    const dateKey = format(date, "yyyy-MM-dd");
    if (view === "month" && eventsByDate[dateKey]) {
      return <div className="w-1 h-1 mx-auto mt-1 rounded-full bg-yellow-500" />;
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    if (isToday(date)) return "bg-blue-100 dark:bg-blue-900";
    return "";
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">📅 Calendar</h2>

      <div className="overflow-x-auto">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="w-full max-w-full calendar-theme"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">
          Events on {format(date, "MMMM d, yyyy")}
        </h3>

        <div className="mt-3 space-y-2">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-100 dark:bg-gray-800 p-3 rounded flex justify-between items-start"
              >
                <div className="text-gray-800 dark:text-gray-100">
                  <strong>{event.title}</strong>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="space-x-2 text-sm">
                  <button
                    onClick={() => handleEdit(event)}
                    className="px-2 py-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-2 py-1 rounded text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No events for this date.</p>
          )}
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-100">
            {editingId ? "Edit Event" : "Add New Event"}
          </h4>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="mb-2 w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
          />
          <textarea
            placeholder="Description (optional)"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="mb-2 w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
          />
          <button
            onClick={handleAddOrUpdate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
          >
            {editingId ? "Update" : "Add"} Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
