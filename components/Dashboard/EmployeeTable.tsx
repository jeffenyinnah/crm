import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import EditEmployeeModal from "../Employee/EditEmployeeModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Employee } from "@/types/employee";
import { useAuth } from "@clerk/nextjs";

const EmployeeTable = () => {
  const { userId } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

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
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <table className="w-full">
          <thead className="hidden md:table-header-group">
            <tr className="text-left text-gray-500">
              <th className="py-2">Employee</th>
              <th>Dept</th>
              <th className="hidden md:table-cell">Job Title</th>
              <th className="hidden md:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-t">
                <td className="py-4">
                  <div className="flex items-center">
                    <div>
                      <div>{employee.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">
                        {employee.jobTitle}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
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
                <td className="hidden md:table-cell">{employee.jobTitle}</td>
                <td className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
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

export default EmployeeTable;
