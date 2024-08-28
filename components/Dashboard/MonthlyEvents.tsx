"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Event {
  id: string;
  title: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}
const MonthlyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const q = query(
        collection(db, "events"),
        where("date", ">=", startOfMonth),
        where("date", "<=", endOfMonth)
      );

      const snapshot = await getDocs(q);
      const eventData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      setEvents(eventData);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        What's on in {new Date().toLocaleString("default", { month: "long" })}?
      </h2>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="mb-2">
            {event.title} -{" "}
            {new Date(event.date.seconds * 1000).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyEvents;
