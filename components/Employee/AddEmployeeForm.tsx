"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { toast } from "../ui/use-toast";
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
import { useAuth } from "@clerk/nextjs";

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  isOpen,
  onClose,
  onEmployeeAdded,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [contractType, setContractType] = useState("");
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [workHours, setWorkHours] = useState(0);
  const [age, setAge] = useState(0);
  const [DOB, setDOB] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const { userId } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!userId) return;
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          department,
          jobTitle,
          contractType,
          monthlySalary,
          attendance: "0h 0m",
          workHours,
          age,
          DOB: DOB ? format(DOB, "yyyy-MM-dd") : "",
          gender,
          address,
          city,
          state,
          startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setJobTitle("");
      setContractType("");
      setMonthlySalary(0);
      setWorkHours(0);
      setAge(0);
      setDOB(undefined);
      setGender("");
      setAddress("");
      setCity("");
      setState("");
      setStartDate(undefined);

      onEmployeeAdded();
      onClose();
      toast({
        title: "Employee added",
        description: "Employee has been added to the database.",
        className: "bg-green-500 text-white",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error adding employee: ", error);
      toast({
        title: "Error adding employee",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">
            Add New Employee
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
                      {DOB ? format(DOB, "PPP") : <span>Pick a date</span>}
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
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full">
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
