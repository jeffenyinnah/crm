"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayrollRecord } from "@/types/payroll";
import { Invoice } from "@/types/Invoice";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  workHours: number;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  bgColor: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MetricCard: React.FC<MetricCardProps> = ({ title, value, bgColor }) => (
  <Card className={`${bgColor} text-white`}>
    <CardHeader>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  } else {
    return value.toLocaleString("pt-PT");
  }
};

const DashboardMetrics: React.FC = () => {
  const { userId, isSignedIn } = useAuth();

  const { data: employees } = useSWR<Employee[]>(
    isSignedIn ? `/api/employees?userId=${userId}` : null,
    fetcher
  );
  const { data: payroll } = useSWR<{ data: PayrollRecord[] }>(
    isSignedIn ? `/api/payroll?userId=${userId}` : null,
    fetcher
  );
  const { data: invoices } = useSWR<Invoice[]>(
    isSignedIn && userId ? `/api/invoices?userId=${userId}` : null,
    fetcher
  );

  const totalEmployees = employees?.length || 0;
  const totalPayroll = React.useMemo(
    () =>
      payroll?.data?.reduce((sum, item) => sum + (item.grossSalary || 0), 0) ||
      0,
    [payroll]
  );
  const totalInvoices = React.useMemo(
    () => invoices?.reduce((sum, item) => sum + (item.total || 0), 0) || 0,
    [invoices]
  );
  const averageWorkHours = React.useMemo(
    () =>
      totalEmployees > 0
        ? (employees?.reduce((sum, emp) => sum + (emp.workHours || 0), 0) ||
            0) / totalEmployees
        : 0,
    [employees, totalEmployees]
  );

  const formattedTotalInvoices = React.useMemo(
    () => formatCurrency(totalInvoices),
    [totalInvoices]
  );

  const formattedTotalPayroll = React.useMemo(
    () => formatCurrency(totalPayroll),
    [totalPayroll]
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Employees"
          value={totalEmployees}
          bgColor="bg-blue-500"
        />
        <MetricCard
          title="Total Invoices"
          value={`MZN ${formattedTotalInvoices}`}
          bgColor="bg-purple-500"
        />
        <MetricCard
          title="Total Payroll"
          value={`MZN ${formattedTotalPayroll}`}
          bgColor="bg-green-500"
        />
        <MetricCard
          title="Average Work Hours"
          value={`${averageWorkHours.toFixed(1)}`}
          bgColor="bg-gray-500"
        />
      </div>
    </>
  );
};

export default DashboardMetrics;
