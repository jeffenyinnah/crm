"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface WorkHours {
  date: string;
  hours: number;
}

const WorkHoursChart = () => {
  const [data, setData] = useState<WorkHours[]>([]);

  useEffect(() => {
    const fetchWorkHours = async () => {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

      const q = query(
        collection(db, "workHours"),
        where("date", ">=", startOfWeek),
        where("date", "<=", endOfWeek),
        orderBy("date")
      );

      const snapshot = await getDocs(q);
      const workHoursData = snapshot.docs.map((doc) => ({
        date: doc
          .data()
          .date.toDate()
          .toLocaleDateString("en-US", { weekday: "short" }),
        hours: doc.data().hours,
      })) as WorkHours[];

      setData(workHoursData);
    };

    fetchWorkHours();
  }, []);

  return (
    <div className="h-64">
      <h2 className="text-xl font-bold mb-4">Member Work Hours</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkHoursChart;
