// export interface Employee {
//     id: string;
//     name: string;
//     monthlySalary: number;
//   }
  
  export interface AttendanceRecord {
    employeeId: string;
    date: string;
    hoursWorked: number;
    overtime: number;
  }
  
  export interface PayrollRecord {
    id?: string;
    employeeId: string;
    employeeName: string;
    startDate: string;
    endDate: string;
    basicSalary: number;
    overtimePay: number;
    grossSalary: number;
    tax: number;
    netSalary: number;
    userId: string;
  }
  
  export interface PayrollGenerationRequest {
    startDate: string;
    endDate: string;
    employeeId: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
  }