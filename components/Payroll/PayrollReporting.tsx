"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PayrollReporting() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleGenerateReport = () => {
    console.log("Generating report for", month, year);
    // Here you would typically call an API to generate the report
  };

  // Dummy data for demonstration
  const reportData = {
    totalPayroll: 150000,
    totalEmployees: 25,
    averageSalary: 6000,
    totalTaxes: 45000,
    totalDeductions: 30000,
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="month">Month</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger id="month">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01">January</SelectItem>
              <SelectItem value="02">February</SelectItem>
              {/* Add other months */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="YYYY"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${reportData.totalPayroll.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reportData.totalEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${reportData.averageSalary.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Taxes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${reportData.totalTaxes.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${reportData.totalDeductions.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
