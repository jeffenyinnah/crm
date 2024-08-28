// "use client";

// import { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Button } from "@/components/ui/button";
// import { DatePicker } from "@/components/ui/date-picker";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface TimeEntry {
//   id: string;
//   employeeId: string;
//   startTime: Date;
//   endTime: Date;
//   duration: number;
// }

// interface TimeTrackingReportProps {
//   employeeId: string;
// }

// const TimeTrackingReport: React.FC<TimeTrackingReportProps> = ({ employeeId }) => {
//   const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
//   const [startDate, setStartDate] = useState<Date>(new Date());
//   const [endDate, setEndDate] = useState<Date>(new Date());

//   const fetchTimeEntries = async () => {
//     const q = query(
//       collection(db, 'workHours'),
//       where('employeeId', '==', employeeId),
//       where('startTime', '>=', startDate),
//       where('endTime', '<=', endDate),
//       orderBy('startTime', 'desc')
//     );

//     const snapshot = await getDocs(q);
//     const entries = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//       startTime: doc.data().startTime.toDate(),
//       endTime: doc.data().endTime.toDate(),
//     } as TimeEntry));

//     setTimeEntries(entries);
//   };

//   useEffect(() => {
//     fetchTimeEntries();
//   }, [employeeId, startDate, endDate]);

//   const totalHours = timeEntries.reduce((total, entry) => total + entry.duration, 0);

//   return (
//     <div>
//       <h3 className="text-xl font-bold mb-4">Time Tracking Report</h3>
//       <div className="flex space-x-4 mb-4">
//         <DatePicker
//           selected={startDate}
//           onChange={(date: Date) => setStartDate(date)}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//         />
//         <DatePicker
//           selected={endDate}
//           onChange={(date: Date) => setEndDate
