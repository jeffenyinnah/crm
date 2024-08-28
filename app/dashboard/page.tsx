import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardMetrics from "@/components/Dashboard/DashboardMetrics";
import WorkHoursChart from "@/components/Dashboard/WorkHoursChart";
import MonthlyEvents from "@/components/Dashboard/MonthlyEvents";
import TodaySchedule from "@/components/Dashboard/TodaySchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { userId } = auth();

  // if (!userId) {
  //   redirect("/sign-in");
  // }

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardMetrics />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Work Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkHoursChart />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Monthly Events</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyEvents />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <TodaySchedule />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
