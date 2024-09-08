export interface Invoice {
    userId: string;
    id: string;
    customerName: string;
    customerEmail: string;
    companyId: string;
    invoiceNumber: number;
    invoiceDate: string;
    dueDate: string;
    items: {
      description: string;
      quantity: number;
      price: number;
    }[];
    total: number;
    vat: number;
    subTotal: number;
    status: InvoiceStatus;
    
  }

  export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

  export type InvoiceItem = {
    description: string;
    quantity: number;
    price: number;
  };

  export type Company = {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    userId: string;
    invoices: Invoice[];
    createdAt: Date;
  };