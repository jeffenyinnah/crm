"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { InvoiceList } from "./InvoiceList";
import { InvoiceForm } from "./InvoiceForm";
import { InvoiceView } from "./InvoiceView";
import { Invoice, Company } from "@/types/Invoice";

export const InvoiceManagement: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const { userId } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewOpen(true);
  };

  const handleDeleteInvoice = useCallback(
    async (invoice: Invoice) => {
      if (!userId || !invoice.id) return;

      try {
        const response = await fetch(`/api/invoices?id=${invoice.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete invoice");
        }

        toast({
          title: "Invoice deleted",
          description: "The invoice has been successfully deleted.",
          className: "bg-green-500 text-white",
        });

        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast({
          title: "Error deleting invoice",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    },
    [userId]
  );

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Implement download functionality
    console.log("Downloading invoice:", invoice);
    toast({
      title: "Download started",
      description: "Your invoice download has started.",
      className: "bg-blue-500 text-white",
    });
  };

  const handleSendInvoice = (invoice: Invoice) => {
    // Implement send functionality
    console.log("Sending invoice:", invoice);
    toast({
      title: "Invoice sent",
      description: "Your invoice has been sent successfully.",
      className: "bg-green-500 text-white",
    });
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    setIsFormOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const onRefresh = useCallback(() => {
    // This function will be passed to InvoiceList to trigger a refresh
    // It should re-fetch the invoices
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <Button onClick={handleCreateInvoice}>Create Invoice</Button>
      </div>

      <InvoiceList
        onEdit={handleEditInvoice}
        onView={handleViewInvoice}
        onDelete={handleDeleteInvoice}
        refreshTrigger={refreshTrigger}
      />

      {isFormOpen && (
        <InvoiceForm
          invoice={selectedInvoice || undefined}
          onSave={handleSaveInvoice}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isViewOpen && selectedInvoice && (
        <InvoiceView
          invoice={selectedInvoice}
          onClose={() => setIsViewOpen(false)}
          onEdit={handleEditInvoice}
          onDownload={handleDownloadInvoice}
          onSend={handleSendInvoice}
        />
      )}
    </div>
  );
};
