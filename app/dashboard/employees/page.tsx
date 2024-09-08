"use client";

import { useState } from "react";
import EmployeeList from "@/components/Employee/EmployeeList";
import AddEmployeeDialog from "@/components/Employee/AddEmployeeForm";
import OrganizationChart from "@/components/Employee/OrganizationChart";
import RequestTimeOff from "@/components/Employee/RequestTimeOff";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

export default function EmployeePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manageEmployees");
  const [employeeListKey, setEmployeeListKey] = useState(0);

  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!isLoaded || !userId) {
    return null;
  }

  const handleEmployeeAdded = () => {
    setEmployeeListKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex space-x-2">
          <Button className="w-full sm:w-auto">Export</Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Add Employee
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={() => setActiveTab("manageEmployees")}
          variant={activeTab === "manageEmployees" ? "default" : "outline"}
          className="flex-grow sm:flex-grow-0"
        >
          Manage Employees
        </Button>
        <Button
          onClick={() => setActiveTab("organizationChart")}
          variant={activeTab === "organizationChart" ? "default" : "outline"}
          className="flex-grow sm:flex-grow-0"
        >
          Organization Chart
        </Button>
        <Button
          onClick={() => setActiveTab("requestTimeOff")}
          variant={activeTab === "requestTimeOff" ? "default" : "outline"}
          className="flex-grow sm:flex-grow-0"
        >
          Request Time Off
        </Button>
      </div>

      <div>
        {activeTab === "manageEmployees" && (
          <EmployeeList key={employeeListKey} />
        )}
        {activeTab === "organizationChart" && <OrganizationChart />}
        {activeTab === "requestTimeOff" && <RequestTimeOff />}
      </div>

      <AddEmployeeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
}
