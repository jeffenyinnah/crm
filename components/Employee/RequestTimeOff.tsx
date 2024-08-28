"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "../ui/use-toast";
import { Toast } from "../ui/toast";

interface Employee {
  id: string;
  name: string;
}

interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  leaveFrom: string;
  leaveTo: string;
  days: number;
  status: string;
}

const RequestTimeOff = () => {
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newRequest, setNewRequest] = useState({
    employeeId: "",
    leaveType: "",
    leaveFrom: "",
    leaveTo: "",
    days: 0,
  });

  useEffect(() => {
    fetchEmployees();
    fetchRequests();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();
    setEmployees(
      data.map((employee: any) => ({
        id: employee.id, // This is now the Firestore document ID
        name: employee.name,
      }))
    );
  };

  const fetchRequests = async () => {
    const response = await fetch("/api/timeoff");
    const data = await response.json();
    setRequests(data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/timeoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
    });
    if (response.ok) {
      setNewRequest({
        employeeId: "",
        leaveType: "",
        leaveFrom: "",
        leaveTo: "",
        days: 0,
      });
      fetchRequests();
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/timeoff?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });
      if (!response.ok) {
        throw new Error("Failed to approve request");
      }
      await fetchRequests();
      toast({
        title: "Request Approved",
        description: "Your Request has been approved",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Error approving request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/timeoff?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });
      if (!response.ok) {
        throw new Error("Failed to reject request");
      }
      await fetchRequests();
      toast({
        title: "Request Rejected",
        description: "Your Request was rejected.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error Processing Request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Request Time Off</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Select
            name="employeeId"
            value={newRequest.employeeId}
            onValueChange={(value) =>
              setNewRequest({ ...newRequest, employeeId: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="leaveType"
            value={newRequest.leaveType}
            onChange={handleInputChange}
            placeholder="Leave Type"
            required
          />
          <Input
            name="leaveFrom"
            type="date"
            value={newRequest.leaveFrom}
            onChange={handleInputChange}
            placeholder="Leave From"
            required
          />
          <Input
            name="leaveTo"
            type="date"
            value={newRequest.leaveTo}
            onChange={handleInputChange}
            placeholder="Leave To"
            required
          />
          <Input
            name="days"
            type="number"
            value={newRequest.days}
            onChange={handleInputChange}
            placeholder="Number of Days"
            required
          />
          <Button type="submit">Submit Request</Button>
        </div>
      </form>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">Employee Name</th>
            <th>Leave Type</th>
            <th>Leave From</th>
            <th>Leave To</th>
            <th>Days</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-t">
              <td className="py-4">{request.employeeName}</td>
              <td>{request.leaveType}</td>
              <td>{request.leaveFrom}</td>
              <td>{request.leaveTo}</td>
              <td>{request.days}</td>
              <td>{request.status}</td>
              <td>
                {request.status === "Pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="mr-2"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTimeOff;
