"use client";

import { useState } from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Employee } from "@/types/employee";
import { useAuth } from "@clerk/nextjs";

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
  const { userId } = useAuth();

  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone);
  const [department, setDepartment] = useState(employee.department);
  const [jobTitle, setJobTitle] = useState(employee.jobTitle);
  const [contractType, setContractType] = useState(employee.contractType);
  const [attendance, setAttendance] = useState(employee.attendance);
  const [monthlySalary, setMonthlySalary] = useState(employee.monthlySalary);
  const [workHours, setWorkHours] = useState(employee.workHours);
  const [age, setAge] = useState(employee.age);
  const [gender, setGender] = useState(employee.gender);
  const [address, setAddress] = useState(employee.address);
  const [city, setCity] = useState(employee.city);
  const [state, setState] = useState(employee.state);
  const [DOB, setDOB] = useState<Date | undefined>(() => {
    const date = new Date(employee.DOB);
    return isValid(date) ? date : undefined;
  });

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date(employee.startDate);
    return isValid(date) ? date : undefined;
  });

  if (!userId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEmployee: Employee = {
      ...employee,
      userId,
      name,
      email,
      phone,
      department,
      jobTitle,
      contractType,
      attendance,
      monthlySalary,
      workHours,
      age,
      DOB: DOB ? new Date(DOB.toISOString().split("T")[0]) : new Date(),
      gender,
      address,
      city,
      state,
      startDate: startDate
        ? new Date(startDate.toISOString().split("T")[0])
        : new Date(),
    };
    onUpdate(updatedEmployee);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">
            Edit Employee
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto px-1"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  placeholder="Department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  placeholder="Job title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractType">Contract Type</Label>
                <Select onValueChange={setContractType} value={contractType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance</Label>
                <Input
                  id="attendance"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  required
                  placeholder="Attendance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlySalary">Monthly Salary</Label>
                <Input
                  id="monthlySalary"
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  required
                  placeholder="Monthly salary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workHours">Work Hours</Label>
                <Input
                  id="workHours"
                  type="number"
                  value={workHours}
                  onChange={(e) => setWorkHours(Number(e.target.value))}
                  required
                  placeholder="Work hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  placeholder="Your age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="DOB">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !DOB && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {DOB && isValid(DOB) ? (
                        format(DOB, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={DOB}
                      onSelect={setDOB}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  placeholder="Your gender"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Your address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select onValueChange={setCity} value={city}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maputo">Maputo</SelectItem>
                    <SelectItem value="Beira">Beira</SelectItem>
                    <SelectItem value="Chimoio">Chimoio</SelectItem>
                    <SelectItem value="Tete">Tete</SelectItem>
                    <SelectItem value="Nampula">Nampula</SelectItem>
                    <SelectItem value="Inhambane">Inhambane</SelectItem>
                    <SelectItem value="Gaza">Gaza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={setState} value={state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maputo">Maputo</SelectItem>
                    <SelectItem value="Sofala">Sofala</SelectItem>
                    <SelectItem value="Manica">Manica</SelectItem>
                    <SelectItem value="Tete">Tete</SelectItem>
                    <SelectItem value="Nampula">Nampula</SelectItem>
                    <SelectItem value="Inhambane">Inhambane</SelectItem>
                    <SelectItem value="Gaza">Gaza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
