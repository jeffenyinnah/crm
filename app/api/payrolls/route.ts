import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, orderBy, doc, getDoc } from 'firebase/firestore';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ){
  if (req.method === 'GET') {
    try {
      const payrollCollection = collection(db, 'payroll');
      const payrollQuery = query(payrollCollection, orderBy('payPeriodEnd', 'desc'));
      const payrollSnapshot = await getDocs(payrollQuery);
      const payrolls = payrollSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.status(200).json(payrolls);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      res.status(500).json({ message: 'Error fetching payrolls' });
    }
  } else if (req.method === 'POST') {
    try {
      const { employeeId, payPeriodStart, payPeriodEnd } = req.body;

      // Fetch employee data
      const employeeDoc = await getDoc(doc(db, 'employees', employeeId));
      
      if (!employeeDoc.exists()) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      const employee = employeeDoc.data();

      // Check if employee has the required fields
      if (!employee || !employee.name || !employee.hourlyRate) {
        return res.status(400).json({ message: 'Invalid employee data' });
      }

      // Fetch work hours for the pay period
      const workHoursQuery = query(
        collection(db, 'workHours'),
        where('employeeId', '==', employeeId),
        where('startTime', '>=', new Date(payPeriodStart)),
        where('endTime', '<=', new Date(payPeriodEnd))
      );
      const workHoursSnapshot = await getDocs(workHoursQuery);

      const totalHours = workHoursSnapshot.docs.reduce(
        (sum, doc) => sum + doc.data().duration,
        0
      );
      const grossPay = totalHours * employee.hourlyRate;
      const taxDeductions = grossPay * 0.2; // Assuming 20% tax
      const otherDeductions = 100; // Example fixed deduction
      const netPay = grossPay - taxDeductions - otherDeductions;

      const payrollData = {
        employeeId,
        employeeName: employee.name,
        payPeriodStart,
        payPeriodEnd,
        totalDays: Math.ceil(totalHours / 8), // Assuming 8-hour workdays
        totalHours,
        amount: grossPay,
        grossPay,
        taxDeductions,
        otherDeductions,
        netPay,
        status: 'Unpaid',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'payroll'), payrollData);
      res.status(201).json({ id: docRef.id, ...payrollData });
    } catch (error) {
      console.error('Error generating payroll:', error);
      res.status(500).json({ message: 'Error generating payroll' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}