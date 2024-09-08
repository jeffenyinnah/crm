"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MonthlyInvoiceTotals() {
  const { userId, isSignedIn } = useAuth();
  const { data, error } = useSWR(
    isSignedIn ? `/api/monthlyInvoiceTotals?userId=${userId}` : null,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Invoice Totals</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
