"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Invoice, InvoiceStatus } from "@/types/Invoice";

interface InvoiceListProps {
  onEdit: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  refreshTrigger: number;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  onEdit,
  onView,
  onDelete,
  refreshTrigger,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, isLoaded, isSignedIn } = useAuth();

  const fetchInvoices = useCallback(async () => {
    if (!userId) {
      console.log("No userId available");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Fetching invoices for userId:", userId);
      const response = await fetch(`/api/invoices?userId=${userId}`);
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.statusText}`);
      }
      const data = await response.json();

      // Sort invoices by date in descending order
      data.sort(
        (a: Invoice, b: Invoice) =>
          new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
      );
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(
        `Error fetching invoices: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      fetchInvoices();
    } else if (isLoaded && !isSignedIn) {
      setError("Please sign in to view invoices");
      setIsLoading(false);
    }
  }, [fetchInvoices, isLoaded, isSignedIn, userId, refreshTrigger]);

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "sent":
        return "text-blue-600";
      case "overdue":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleDelete = (invoice: Invoice) => {
    onDelete(invoice);
  };

  if (isLoading) return <div>Loading invoices...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (invoices.length === 0) return <div>No invoices found.</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="hidden md:block">
        {/* Desktop view */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.invoiceDate}</TableCell>
                <TableCell>MZN{invoice.total.toFixed(2)}</TableCell>
                <TableCell className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(invoice)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(invoice)}
                    className="ml-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(invoice)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden">
        {/* Mobile and tablet view */}
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="mb-4 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">
                Invoice #{invoice.invoiceNumber}
              </span>
              <span className={`${getStatusColor(invoice.status)} font-medium`}>
                {invoice.status}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Customer:</span>{" "}
              {invoice.customerName}
            </div>
            <div className="mb-2">
              <span className="font-medium">Date:</span> {invoice.invoiceDate}
            </div>
            <div className="mb-4">
              <span className="font-medium">Total:</span> MZN
              {invoice.total.toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(invoice)}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(invoice)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(invoice)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
