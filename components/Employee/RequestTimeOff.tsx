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
import { Employee } from "@/types/employee";
import { useAuth } from "@clerk/nextjs";

interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  leaveFrom: string;
  leaveTo: string;
  days: number;
  status: string;
  userId: string;
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
  const { userId } = useAuth();
  useEffect(() => {
    fetchEmployees();
    fetchRequests();
  }, []);

  const fetchEmployees = async () => {
    if (userId) {
      const response = await fetch(`/api/employees?userId=${userId}`);
      const data = await response.json();
      setEmployees(
        data.map((employee: any) => ({
          id: employee.id, // This is now the Firestore document ID
          name: employee.name,
          userId: employee.userId,
        }))
      );
    }
  };

  const fetchRequests = async () => {
    if (userId) {
      const response = await fetch(`/api/timeoff?userId=${userId}`);
      const data = await response.json();
      setRequests(data);
    } else {
      console.error("User ID is required");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      const response = await fetch(`/api/timeoff?userId=${userId}`, {
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
      } else {
        console.error("Failed to submit request");
      }
    }
  };

  const handleApprove = async (id: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/timeoff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved", userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to approve request");
      }
      await fetchRequests();
      toast({
        title: "Request Approved",
        description: "The request has been approved",
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
    if (!userId) return;

    try {
      const response = await fetch(`/api/timeoff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected", userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to reject request");
      }
      await fetchRequests();
      toast({
        title: "Request Rejected",
        description: "The request was rejected.",
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

  const handleDelete = async (id: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/timeoff/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to delete request");
      }
      await fetchRequests();
      toast({
        title: "Request Deleted",
        description: "The request was deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error Deleting Request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Request Time Off</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <Button type="submit" className="sm:col-span-2">
            Submit Request
          </Button>
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="hidden sm:table-header-group">
            <tr className="text-left text-gray-500">
              <th className="py-2">Employee Name</th>
              <th className="hidden md:table-cell">Leave Type</th>
              <th className="hidden lg:table-cell">Leave From</th>
              <th className="hidden lg:table-cell">Leave To</th>
              <th className="hidden md:table-cell">Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="py-4">
                  <div>
                    <span className="font-medium">{request.employeeName}</span>
                    <span className="block sm:hidden text-sm text-gray-500">
                      {request.leaveType} - {request.days} days
                    </span>
                    <span className="block sm:hidden text-xs text-gray-400">
                      {request.leaveFrom} to {request.leaveTo}
                    </span>
                  </div>
                </td>
                <td className="hidden md:table-cell">{request.leaveType}</td>
                <td className="hidden lg:table-cell">{request.leaveFrom}</td>
                <td className="hidden lg:table-cell">{request.leaveTo}</td>
                <td className="hidden md:table-cell">{request.days}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      request.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : request.status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {request.status === "Pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
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
                    {(request.status === "Approved" ||
                      request.status === "Rejected") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(request.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestTimeOff;
