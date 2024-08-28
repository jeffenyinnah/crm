// components/TimeTracker.tsx
"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

interface TimeTrackerProps {
  employeeId: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ employeeId }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    fetchTotalHours();
  }, [employeeId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const fetchTotalHours = async () => {
    const q = query(
      collection(db, "workHours"),
      where("employeeId", "==", employeeId)
    );
    const querySnapshot = await getDocs(q);
    const total = querySnapshot.docs.reduce(
      (acc, doc) => acc + doc.data().duration,
      0
    );
    setTotalHours(total);
  };

  const startTracking = () => {
    setIsTracking(true);
    setStartTime(new Date());
  };

  const stopTracking = async () => {
    setIsTracking(false);
    if (startTime) {
      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000 / 3600; // in hours

      try {
        await addDoc(collection(db, "workHours"), {
          employeeId,
          startTime,
          endTime,
          duration,
        });
        alert("Work hours recorded successfully!");
        fetchTotalHours();
      } catch (error) {
        console.error("Error recording work hours: ", error);
        alert("Error recording work hours. Please try again.");
      }
    }
    setStartTime(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <p>Current Session: {formatTime(elapsedTime)}</p>
      <p>Total Hours: {totalHours.toFixed(2)}</p>
      {!isTracking ? (
        <Button onClick={startTracking}>Start Tracking</Button>
      ) : (
        <Button onClick={stopTracking} variant="destructive">
          Stop Tracking
        </Button>
      )}
    </div>
  );
};

export default TimeTracker;
