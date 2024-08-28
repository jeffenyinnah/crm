"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Filter } from "lucide-react";

// Dummy data
const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    department: "Engineering",
    salary: 75000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    department: "Marketing",
    salary: 65000,
    payPeriod: "Bi-weekly",
    lastPayDate: "2023-08-04",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    department: "Sales",
    salary: 80000,
    payPeriod: "Monthly",
    lastPayDate: "2023-07-31",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    department: "HR",
    salary: 70000,
    payPeriod: "Bi-weekly",
    lastPayDate: "2023-08-04",
  },
];

export default function PayrollList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Pay Period</TableHead>
            <TableHead>Last Pay Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="mr-2">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.name}`}
                    />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{employee.name}</div>
                    <div className="text-sm text-gray-500">
                      {employee.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>${employee.salary.toLocaleString()}</TableCell>
              <TableCell>{employee.payPeriod}</TableCell>
              <TableCell>{employee.lastPayDate}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
