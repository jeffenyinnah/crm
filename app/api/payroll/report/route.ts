import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { PayrollRecord } from '@/types/payroll';
// import { useEffect } from 'react';

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, employeeId } = await request.json();
    let payrollData: PayrollRecord[];

    console.log(`Generating report for: ${employeeId ? `Employee ${employeeId}` : 'All employees'}`);
    console.log(`Date range: ${new Date(startDate).toISOString()} to ${new Date(endDate).toISOString()}`);

    const baseQuery = query(
      collection(db, 'payroll'),
      where('startDate', '>=', new Date(startDate).toISOString()),
      where('endDate', '<=', new Date(endDate).toISOString())
    );

    if (employeeId && employeeId !== 'all') {
      // Individual report
      const individualQuery = query(baseQuery, where('employeeId', '==', employeeId));
      const payrollSnapshot = await getDocs(individualQuery);
      payrollData = payrollSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayrollRecord));
    } else {
      // Bulk report
      const payrollSnapshot = await getDocs(baseQuery);
      payrollData = payrollSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayrollRecord));
    }

    console.log(`Found ${payrollData.length} payroll records`);

    // Generate CSV content
    let csvContent = "Employee ID,Employee Name,Start Date,End Date,Basic Salary,Overtime Pay,Gross Salary,Tax,Net Salary\n";

    payrollData.forEach((payroll) => {
      csvContent += `${payroll.employeeId},${payroll.employeeName},${new Date(payroll.startDate).toLocaleDateString()},${new Date(payroll.endDate).toLocaleDateString()},${payroll.basicSalary},${payroll.overtimePay},${payroll.grossSalary},${payroll.tax},${payroll.netSalary}\n`;
    });

    // If it's a bulk report, add summary rows
    if (!employeeId || employeeId === 'all') {
      csvContent += "\nSummary\n";
      csvContent += `Total Employees,${payrollData.length}\n`;
      csvContent += `Total Basic Salary,${payrollData.reduce((sum, payroll) => sum + payroll.basicSalary, 0).toFixed(2)}\n`;
      csvContent += `Total Overtime Pay,${payrollData.reduce((sum, payroll) => sum + payroll.overtimePay, 0).toFixed(2)}\n`;
      csvContent += `Total Gross Salary,${payrollData.reduce((sum, payroll) => sum + payroll.grossSalary, 0).toFixed(2)}\n`;
      csvContent += `Total Tax,${payrollData.reduce((sum, payroll) => sum + payroll.tax, 0).toFixed(2)}\n`;
      csvContent += `Total Net Salary,${payrollData.reduce((sum, payroll) => sum + payroll.netSalary, 0).toFixed(2)}\n`;
    }

    console.log('CSV content generated successfully');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="payroll_report.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating payroll report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

// useEffect(() => {
//   // Place any code that uses 'location' here
//   // For example:
//   // const currentPath = location.pathname;
// }, []); // Empty dependency array means this runs once on component mount