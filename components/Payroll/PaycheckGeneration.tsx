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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PaycheckGeneration() {
  const [payPeriod, setPayPeriod] = useState("");
  const [payDate, setPayDate] = useState("");

  // Dummy data for demonstration
  const employees = [
    {
      id: 1,
      name: "John Doe",
      basePay: 3125,
      overtime: 250,
      deductions: 800,
      netPay: 2575,
    },
    {
      id: 2,
      name: "Jane Smith",
      basePay: 2708,
      overtime: 0,
      deductions: 650,
      netPay: 2058,
    },
    {
      id: 3,
      name: "Bob Johnson",
      basePay: 3333,
      overtime: 500,
      deductions: 900,
      netPay: 2933,
    },
  ];

  const handleGeneratePaychecks = () => {
    console.log("Generating paychecks for", payPeriod, "on", payDate);
    // Here you would typically call an API to generate the paychecks
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="payPeriod">Pay Period</Label>
          <Select value={payPeriod} onValueChange={setPayPeriod}>
            <SelectTrigger id="payPeriod">
              <SelectValue placeholder="Select pay period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="august-1-15">August 1-15, 2023</SelectItem>
              <SelectItem value="august-16-31">August 16-31, 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payDate">Pay Date</Label>
          <Input
            id="payDate"
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleGeneratePaychecks}>Generate Paychecks</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Base Pay</TableHead>
            <TableHead>Overtime</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Pay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>${employee.basePay.toLocaleString()}</TableCell>
              <TableCell>${employee.overtime.toLocaleString()}</TableCell>
              <TableCell>${employee.deductions.toLocaleString()}</TableCell>
              <TableCell>${employee.netPay.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
