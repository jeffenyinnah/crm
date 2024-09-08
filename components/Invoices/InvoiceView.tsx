"use client";
import React, { useCallback, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Invoice, Company } from "@/types/Invoice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "@clerk/nextjs";
import { Download, Edit, Send } from "lucide-react";

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoice,
  onClose,
  onEdit,
  onDownload,
  onSend,
}) => {
  const [company, setCompany] = useState<Company | null>(null);
  const { userId } = useAuth();

  const fetchCompany = useCallback(async () => {
    if (!userId || !invoice.companyId) return;
    try {
      const response = await fetch(
        `/api/invoices/companies/${invoice.companyId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch company");
      }
      const data = await response.json();
      setCompany(data.companyData);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  }, [invoice.companyId, userId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleDownload = () => {
    const doc = new jsPDF();

    // Add company logo
    const logoUrl = "/logo.png"; // Replace with your actual logo path
    doc.addImage(logoUrl, "PNG", 10, 10, 50, 20);

    // Add invoice details
    doc.setFontSize(18);
    doc.text(`Invoice GAL#${invoice.invoiceNumber}`, 10, 50);

    doc.setFontSize(12);
    doc.text("From: Green Agro Limited ", 10, 70);
    doc.text(`To: ${company?.name}`, 10, 80);
    doc.text(`Email: ${company?.email}`, 10, 90);
    doc.text(`Invoice Date: ${invoice.invoiceDate}`, 10, 100);
    doc.text(`Due Date: ${invoice.dueDate}`, 10, 110);
    doc.text(`Status: ${invoice.status}`, 10, 120);

    // Add table for invoice items
    const tableColumn = ["Description", "Quantity", "Price", "Total"];
    const tableRows = invoice.items.map((item) => [
      item.description,
      item.quantity,
      `MZN ${item.price}`,
      `MZN ${item.quantity * item.price}`,
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 130,
    });

    // Add total
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    doc.text(`Subtotal: MZN ${invoice.subTotal.toFixed(2)}`, 14, finalY + 15);
    doc.text(
      `VAT (${invoice.vat}%): MZN ${(invoice.total - invoice.subTotal).toFixed(
        2
      )}`,
      14,
      finalY + 25
    );
    doc.text(`Total: MZN ${invoice.total.toFixed(2)}`, 14, finalY + 35);

    // Save the PDF
    doc.save(`Invoice-GAL#${invoice.invoiceNumber}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-white pb-4 mb-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              Invoice GAL#{invoice.invoiceNumber}
            </DialogTitle>
            {/* <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span> */}
          </div>
        </DialogHeader>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">From:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Green Agro Limited</p>
                <p>Mocambique</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">To:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{company?.name}</p>
                <p>{company?.address}</p>
                <p>{company?.email}</p>
                <p>{company?.phone}</p>
                <p>{invoice.customerName}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Invoice Details:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <span className="font-medium">Invoice Date:</span>{" "}
                  {invoice.invoiceDate}
                </p>
                <p>
                  <span className="font-medium">Due Date:</span>{" "}
                  {invoice.dueDate}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Items:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">MZN {item.price}</td>
                      <td className="px-4 py-2 text-right">
                        MZN {item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Summary:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>MZN {invoice.subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({invoice.vat}%):</span>
                <span>MZN {invoice.total - invoice.subTotal}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>MZN {invoice.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 mt-8">
          <Button onClick={() => onEdit(invoice)} variant="outline">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button onClick={() => onSend(invoice)}>
            <Send className="w-4 h-4 mr-2" /> Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
