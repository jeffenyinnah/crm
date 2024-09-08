"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
}
const TodaySchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const q = query(collection(db, "schedule"), where("date", "==", today));

      const snapshot = await getDocs(q);
      const scheduleData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ScheduleItem[];

      setSchedule(scheduleData);
    };

    fetchSchedule();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Today&apos;s Schedule</h2>
      <ul>
        {schedule.map((item) => (
          <li key={item.id} className="mb-2">
            {item.time} - {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodaySchedule;
