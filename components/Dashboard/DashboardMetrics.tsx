"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    jobApplicants: 0,
    totalPayroll: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const employeesSnapshot = await getDocs(collection(db, "employees"));
      const applicantsSnapshot = await getDocs(collection(db, "applicants"));
      const payrollSnapshot = await getDocs(collection(db, "payroll"));

      const totalPayroll = payrollSnapshot.docs.reduce(
        (sum, doc) => sum + doc.data().amount,
        0
      );

      setMetrics({
        totalEmployees: employeesSnapshot.size,
        jobApplicants: applicantsSnapshot.size,
        totalPayroll,
      });
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-blue-500 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl">{metrics.totalEmployees}</p>
        </CardContent>
      </Card>

      <Card className="bg-purple-500 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Job Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl">{metrics.jobApplicants}</p>
        </CardContent>
      </Card>

      <Card className="bg-green-500 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Total Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl">${metrics.totalPayroll.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
