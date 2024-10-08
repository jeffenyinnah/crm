"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Edit, Trash, ChevronRight } from "lucide-react";
import EditEmployeeModal from "./EditEmployeeModal";
import { useToast, toast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import { Employee } from "@/types/employee";

const EmployeeList = () => {
  const { userId } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [userId]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/employees?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "Error fetching employees",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast({
      title: "Confirm deletion",
      description: "Are you sure you want to delete this employee?",
      action: (
        <Button variant="destructive" onClick={() => deleteEmployee(id)}>
          Delete
        </Button>
      ),
      duration: 3000,
    });
    const deleteEmployee = async (id: string) => {
      try {
        const response = await fetch(`/api/employees/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }
        fetchEmployees();
        toast({
          title: "Employee deleted",
          description: "Employee has been deleted.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast({
          title: "Error deleting employee",
          description: "Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleUpdate = async (updatedEmployee: Employee) => {
    try {
      const response = await fetch(`/api/employees/${updatedEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      });
      if (!response.ok) {
        throw new Error("Failed to update employee");
      }
      setEditingEmployee(null);
      fetchEmployees();
      toast({
        title: "Employee updated",
        description: "Employee has been updated.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error updating employee",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <Input
          type="text"
          placeholder="Search keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="hidden md:table-header-group">
            <tr className="text-left text-gray-500">
              <th className="py-2">Employee Name</th>
              <th className="hidden lg:table-cell">Phone Number</th>
              <th>Department</th>
              <th className="hidden lg:table-cell">Job Title</th>
              <th className="hidden lg:table-cell">Contract Type</th>
              <th className="hidden lg:table-cell">Attendance</th>
              <th className="hidden lg:table-cell">Work Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-t">
                <td className="py-4">
                  <div className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.name}`}
                      />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{employee.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">
                        {employee.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden lg:table-cell">{employee.phone}</td>
                <td className="hidden md:table-cell">
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: getColorForDepartment(
                        employee.department
                      ),
                      color: "white",
                    }}
                  >
                    {employee.department}
                  </span>
                </td>
                <td className="hidden lg:table-cell">{employee.jobTitle}</td>
                <td className="hidden lg:table-cell">
                  {employee.contractType}
                </td>
                <td className="hidden lg:table-cell">{employee.attendance}</td>
                <td className="hidden lg:table-cell">{employee.workHours}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => handleEdit(employee)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <p>Loading...</p>}
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

function getColorForDepartment(department: string): string {
  const colors: { [key: string]: string } = {
    Design: "#10B981",
    Development: "#3B82F6",
    HR: "#8B5CF6",
    PM: "#F59E0B",
  };
  return colors[department] || "#6B7280";
}

export default EmployeeList;
