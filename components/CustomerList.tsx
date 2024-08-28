"use client";
import { useState, useEffect } from "react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers");
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data: Customer[] = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Customer List</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer._id}>
            {customer.name} - {customer.email} - {customer.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerList;
