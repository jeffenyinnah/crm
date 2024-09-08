"use client";

import React, { useState, useEffect } from "react";
// import cuid from "cuid";
import { useAuth } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "@/types/Invoice";

type CompanySelectorProps = {
  selectedCompanyId: string;
  onCompanySelect: (companyId: string) => void;
};

export function CompanySelector({
  selectedCompanyId,
  onCompanySelect,
}: CompanySelectorProps) {
  const { userId } = useAuth();
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompany, setNewCompany] = useState<Company>({
    name: "",
    address: "",
    email: "",
    phone: "",
    userId: userId || "",
    invoices: [],
    createdAt: new Date(),
    id: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (userId) {
        const response = await fetch(
          `/api/invoices/companies?userId=${userId}`
        );
        const data = await response.json();
        setCompanies(data);
      }
    };
    fetchCompanies();
  }, [userId]);

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  const submitNewCompany = async () => {
    if (newCompany.name && userId) {
      try {
        const response = await fetch(
          `/api/invoices/companies?userId=${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newCompany, userId }),
          }
        );
        const createdCompany = await response.json();
        setCompanies([...companies, createdCompany]);
        onCompanySelect(createdCompany.id);
        setIsAddingCompany(false);
        setNewCompany({
          name: "",
          address: "",
          email: "",
          phone: "",
          id: "",
          userId: "",
          invoices: [],
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error adding company:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="companyId">Company</Label>
      {isAddingCompany ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="name"
            value={newCompany.name}
            onChange={handleCompanyInputChange}
            placeholder="Company Name"
          />
          <Input
            name="address"
            value={newCompany.address}
            onChange={handleCompanyInputChange}
            placeholder="Company Address"
          />
          <Input
            name="email"
            value={newCompany.email}
            onChange={handleCompanyInputChange}
            placeholder="Company Email"
          />
          <Input
            name="phone"
            value={newCompany.phone}
            onChange={handleCompanyInputChange}
            placeholder="Company Phone"
          />
          <Button type="button" onClick={submitNewCompany}>
            Add Company
          </Button>
          <Button type="button" onClick={() => setIsAddingCompany(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Select
          value={selectedCompanyId || undefined}
          onValueChange={(value) =>
            value === "new" ? setIsAddingCompany(true) : onCompanySelect(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Select a company</SelectItem>
            {companies
              .filter((company) => company.id !== "") // Filter out companies with empty IDs
              .map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            <SelectItem value="new">
              <PlusCircle className="mr-2 h-4 w-4 inline" />
              Add new company
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
