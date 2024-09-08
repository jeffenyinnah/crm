"use client";

import { redirect } from "next/navigation";
import DashboardMetrics from "@/components/Dashboard/DashboardMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeeTable from "@/components/Dashboard/EmployeeTable";
import AgeDistribution from "@/components/Dashboard/AgeDistribution ";
import { useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId } = useAuth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardMetrics />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Employee Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AgeDistribution />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Employee Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
