"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Invoice, InvoiceItem } from "@/types/Invoice";
import { CompanySelector } from "./CompanySelector";

type InvoiceFormProps = {
  invoice?: Invoice;
  onSave: (invoice: Invoice) => void;
  onClose: () => void;
};

export function InvoiceForm({ invoice, onSave, onClose }: InvoiceFormProps) {
  const { userId } = useAuth();
  const [formData, setFormData] = useState<Partial<Invoice>>({
    customerName: "",
    customerEmail: "",
    companyId: "",
    items: [{ description: "", quantity: 0, price: 0 }],
    subTotal: 0,
    vat: 0,
    total: 0,
    status: "draft",
    invoiceDate: "",
    dueDate: "",
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.vat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updatedItems = formData.items!.map((item, i) =>
      i === index
        ? { ...item, [field]: field === "description" ? value : Number(value) }
        : item
    );
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { description: "", quantity: 0, price: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items!.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const subTotal = formData.items!.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const total = subTotal + (subTotal * (formData.vat || 0)) / 100;
    setFormData((prev) => ({ ...prev, subTotal, total }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const response = await fetch("/api/invoices", {
        method: invoice ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save invoice");
      }

      const savedInvoice = await response.json();
      onSave(savedInvoice);
      toast({
        title: `Invoice ${invoice ? "updated" : "created"}`,
        description: `Your invoice has been successfully ${
          invoice ? "updated" : "created"
        }.`,
        className: "bg-green-500 text-white",
      });

      onClose();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        title: "Error saving invoice",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-3 border-b">
          <DialogTitle>
            {invoice ? "Edit Invoice" : "Create Invoice"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6">
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  type="email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    type="date"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    type="date"
                  />
                </div>
              </div>
              <CompanySelector
                selectedCompanyId={formData.companyId || ""}
                onCompanySelect={(id) =>
                  setFormData((prev) => ({ ...prev, companyId: id }))
                }
              />
            </div>

            <Separator />

            <div>
              <Label>Invoice Items</Label>
              {formData.items!.map((item, index) => (
                <div key={index} className="mt-2 space-y-2">
                  <Label htmlFor={`item-description-${index}`}>
                    Description
                  </Label>
                  <Input
                    id={`item-description-${index}`}
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    placeholder="Enter item description"
                  />
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`item-quantity-${index}`}
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        type="number"
                        placeholder="Qty"
                      />
                    </div>
                    <div className="w-1/3">
                      <Label htmlFor={`item-price-${index}`}>Price</Label>
                      <Input
                        id={`item-price-${index}`}
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        type="number"
                        placeholder="Price"
                      />
                    </div>
                    <div className="w-1/3 flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addItem}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="vat">VAT (%)</Label>
                <Input
                  id="vat"
                  name="vat"
                  value={formData.vat}
                  onChange={handleChange}
                  type="number"
                  className="w-24"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Sub Total:</span>
                <span>MZN {formData.subTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>MZN {formData.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 py-3 border-t">
          <Button type="submit" onClick={handleSubmit}>
            {invoice ? "Update Invoice" : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
