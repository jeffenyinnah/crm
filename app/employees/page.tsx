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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div>
          <Button className="mr-2">Export</Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Employee</Button>
        </div>
      </div>

      <div className="flex mb-4">
        <Button
          onClick={() => setActiveTab("manageEmployees")}
          variant={activeTab === "manageEmployees" ? "default" : "outline"}
          className="mr-2"
        >
          Manage Employees
        </Button>
        <Button
          onClick={() => setActiveTab("organizationChart")}
          variant={activeTab === "organizationChart" ? "default" : "outline"}
          className="mr-2"
        >
          Organization Chart
        </Button>
        <Button
          onClick={() => setActiveTab("requestTimeOff")}
          variant={activeTab === "requestTimeOff" ? "default" : "outline"}
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
