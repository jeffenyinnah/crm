import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, CollectionReference, Query, DocumentData } from 'firebase/firestore';
import { AttendanceRecord, PayrollRecord, PayrollGenerationRequest } from '@/types/payroll';
import { Employee } from '@/types/employee';

export async function POST(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { startDate, endDate, employeeId }: PayrollGenerationRequest = await request.json();
    
    let employeesQuery: CollectionReference<DocumentData> | Query<DocumentData> = collection(db, 'employees');
    if (employeeId) {
      employeesQuery = query(employeesQuery, where('id', '==', employeeId));
    }
    const employeesSnapshot = await getDocs(employeesQuery);
    const employees: Employee[] = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));

    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    const attendanceSnapshot = await getDocs(attendanceQuery);
    const attendanceData: AttendanceRecord[] = attendanceSnapshot.docs.map(doc => doc.data() as AttendanceRecord);

    const payrollData: PayrollRecord[] = employees.map(employee => {
      const employeeAttendance = attendanceData.filter(a => a.employeeId === employee.id);
      const totalHours = employeeAttendance.reduce((sum, a) => sum + a.hoursWorked, 0);
      const totalOvertime = employeeAttendance.reduce((sum, a) => sum + a.overtime, 0);
      
      const basicSalary = employee.monthlySalary;
      const overtimePay = totalOvertime * (employee.monthlySalary / 160) * 1.5;
      const grossSalary = basicSalary + overtimePay;
      const tax = grossSalary * 0.2;
      const netSalary = grossSalary - tax;

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        startDate,
        endDate,
        basicSalary,
        overtimePay,
        grossSalary,
        tax,
        netSalary,
        userId
      };
    });

    const payrollRef = collection(db, 'payroll');
    const savedPayrolls = await Promise.all(payrollData.map(payroll => addDoc(payrollRef, payroll)));

    return NextResponse.json({ data: savedPayrolls.map(doc => doc.id) });
  } catch (error) {
    console.error('Error generating payroll:', error);
    return NextResponse.json({ error: 'Failed to generate payroll' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const q = query(collection(db, 'payroll'), where('userId', '==', userId));
    const payrollSnapshot = await getDocs(q);
    const payrollData: PayrollRecord[] = payrollSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayrollRecord));
    return NextResponse.json({ data: payrollData });
  } catch (error) {
    console.error('Error fetching payroll data:', error);
    return NextResponse.json({ error: 'Failed to fetch payroll data' }, { status: 500 });
  }
}