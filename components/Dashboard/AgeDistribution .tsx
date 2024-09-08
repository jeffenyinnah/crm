"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useAuth } from "@clerk/nextjs";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function AgeDistribution() {
  const { userId, isSignedIn } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchData = async () => {
    if (isSignedIn && userId) {
      try {
        console.log("Fetching data for userId:", userId);
        const response = await fetch(`/api/ageDistribution?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Fetched data:", result);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    } else {
      console.log("User not signed in or userId not available");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isSignedIn, userId]);

  const refreshData = () => {
    setRefresh(true);
    fetchData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <Card className="w-full h-[400px] p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Button onClick={refreshData} size="sm" className="ml-auto">
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div>No age distribution data available</div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ageRange"
                  label={{
                    value: "Age Range",
                    offset: 0,
                    position: "insideBottom",
                  }}
                />
                <YAxis
                  label={{
                    value: "Frequency",
                    offset: 0,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
