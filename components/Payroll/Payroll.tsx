"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast, toast } from "@/components/ui/use-toast";
import { PayrollRecord, ApiResponse } from "@/types/payroll";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Employee } from "@/types/employee";
import { useAuth } from "@clerk/nextjs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PayrollPage: React.FC = () => {
  const { userId } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [editingPayroll, setEditingPayroll] = useState<PayrollRecord | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
    fetchPayrollData();
  }, [userId]);

  const fetchEmployees = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/employees?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON response, got ${contentType}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected an array of employees");
      }

      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      });
    }
  };

  const fetchPayrollData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/payroll?userId=${userId}`);
      const data: ApiResponse<PayrollRecord[]> = await response.json();
      if (data.data) {
        setPayrollData(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch payroll data");
      }
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payroll data",
        variant: "destructive",
      });
    }
  };

  const generatePayroll = async (isBulk: boolean) => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/payroll?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          employeeId: isBulk ? null : selectedEmployee,
        }),
      });
      const data: ApiResponse<string[]> = await response.json();
      if (data.data) {
        toast({
          title: "Success",
          description: `Payroll generated successfully for ${
            isBulk ? "all employees" : "selected employee"
          }`,
        });
        fetchPayrollData(); // Refresh payroll data
      } else {
        throw new Error(data.error || "Failed to generate payroll");
      }
    } catch (error) {
      console.error("Error generating payroll:", error);
      toast({
        title: "Error",
        description: "Failed to generate payroll",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const generateReport = async () => {
    try {
      const response = await fetch("/api/payroll/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          employeeId: selectedEmployee === "all" ? "all" : selectedEmployee,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "payroll_report.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast({
          title: "Success",
          description: "Payroll report generated and downloaded successfully",
          duration: 2000,
        });
      } else {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate payroll report",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const updatePayroll = async (payroll: PayrollRecord) => {
    try {
      const response = await fetch(`/api/payroll/${payroll.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payroll),
      });
      const data: ApiResponse<string> = await response.json();
      if (data.data) {
        toast({
          title: "Success",
          description: "Payroll updated successfully",
        });
        setIsEditDialogOpen(false);
        fetchPayrollData(); // Refresh payroll data
      } else {
        throw new Error(data.error || "Failed to update payroll");
      }
    } catch (error) {
      console.error("Error updating payroll:", error);
      toast({
        title: "Error",
        description: "Failed to update payroll",
        variant: "destructive",
      });
    }
  };

  const deletePayroll = async (id: string) => {
    toast({
      title: "Confirm deletion",
      description: "Are you sure you want to delete this payroll record?",
      action: (
        <Button variant="destructive" onClick={() => handleDeletePayroll(id)}>
          Delete
        </Button>
      ),
      duration: 3000,
    });

    const handleDeletePayroll = async (id: string) => {
      try {
        const response = await fetch(`/api/payroll/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete payroll");
        }
        const data: ApiResponse<string> = await response.json();
        if (data.data) {
          toast({
            title: "Success",
            description: "Payroll deleted successfully",
            duration: 2000,
            className: "bg-green-500",
          });
          fetchPayrollData(); // Refresh payroll data
        } else {
          throw new Error(data.error || "Failed to delete payroll");
        }
      } catch (error) {
        console.error("Error deleting payroll:", error);
        toast({
          title: "Error",
          description: "Failed to delete payroll",
          variant: "destructive",
        });
      }
    };
  };

  const renderMobileTable = (payroll: PayrollRecord) => (
    <Card key={payroll.id} className="mb-4 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{payroll.employeeName}</h3>
          <span className="text-sm text-gray-500">
            {new Date(payroll.startDate).toLocaleDateString()} -{" "}
            {new Date(payroll.endDate).toLocaleDateString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Basic Salary:</span> MZN{" "}
            {payroll.basicSalary}
          </div>
          <div>
            <span className="font-medium">Net Salary:</span> MZN{" "}
            {payroll.netSalary}
          </div>
        </div>
        <div className="mt-3 flex justify-end space-x-2">
          <Button
            onClick={() => {
              setEditingPayroll(payroll);
              setIsEditDialogOpen(true);
            }}
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => deletePayroll(payroll.id!)}
            variant="destructive"
            size="sm"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDesktopTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Basic Salary</TableHead>
          <TableHead>Overtime Pay</TableHead>
          <TableHead>Gross Salary</TableHead>
          <TableHead>Tax</TableHead>
          <TableHead>Net Salary</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payrollData.map((payroll) => (
          <TableRow key={payroll.id}>
            <TableCell>{payroll.employeeName}</TableCell>
            <TableCell>{`${new Date(
              payroll.startDate
            ).toLocaleDateString()} - ${new Date(
              payroll.endDate
            ).toLocaleDateString()}`}</TableCell>
            <TableCell>MZN {payroll.basicSalary}</TableCell>
            <TableCell>MZN {payroll.overtimePay}</TableCell>
            <TableCell>MZN {payroll.grossSalary}</TableCell>
            <TableCell>MZN {payroll.tax}</TableCell>
            <TableCell>MZN {payroll.netSalary}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setEditingPayroll(payroll);
                    setIsEditDialogOpen(true);
                  }}
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deletePayroll(payroll.id!)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payroll Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Select Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {endDate ? format(endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button
              onClick={() => generatePayroll(false)}
              disabled={!selectedEmployee}
              className="w-full"
            >
              Generate Payroll
            </Button>
            <Button onClick={() => generatePayroll(true)} className="w-full">
              Bulk Generate Payroll
            </Button>
            <Button onClick={generateReport} className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 w-full">
        <CardHeader>
          <CardTitle>Payroll Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            {renderDesktopTable()}
          </div>
          <div className="md:hidden">{payrollData.map(renderMobileTable)}</div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Payroll</DialogTitle>
          </DialogHeader>
          {editingPayroll && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="basicSalary" className="text-right">
                  Basic Salary
                </label>
                <Input
                  id="basicSalary"
                  value={editingPayroll.basicSalary}
                  onChange={(e) =>
                    setEditingPayroll({
                      ...editingPayroll,
                      basicSalary: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="overtimePay" className="text-right">
                  Overtime Pay
                </label>
                <Input
                  id="overtimePay"
                  value={editingPayroll.overtimePay}
                  onChange={(e) =>
                    setEditingPayroll({
                      ...editingPayroll,
                      overtimePay: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              {/* Add more fields as needed */}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => editingPayroll && updatePayroll(editingPayroll)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollPage;
