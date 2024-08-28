"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  contractType: string;
  attendance: string;
}

interface EditEmployeeModalProps {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void;
  onClose: () => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  employee,
  onUpdate,
  onClose,
}) => {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone);
  const [department, setDepartment] = useState(employee.department);
  const [jobTitle, setJobTitle] = useState(employee.jobTitle);
  const [contractType, setContractType] = useState(employee.contractType);
  const [attendance, setAttendance] = useState(employee.attendance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEmployee = {
      id: employee.id,
      name,
      email,
      phone,
      department,
      jobTitle,
      contractType,
      attendance,
    };
    onUpdate(updatedEmployee);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contractType">Contract Type</Label>
              <Input
                id="contractType"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="attendance">Attendance</Label>
              <Input
                id="attendance"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" className="mr-2">
              Update
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
