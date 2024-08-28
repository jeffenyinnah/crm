"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayrollList from "@/components/Payroll/PayrollList";
import PaycheckGeneration from "@/components/Payroll/PaycheckGeneration";
import PayrollReporting from "@/components/Payroll/PayrollReporting";

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState("manage");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payroll</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export</Button>
          <Button>Generate Paychecks</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b w-full justify-start">
            <TabsTrigger value="manage">Manage Payroll</TabsTrigger>
            <TabsTrigger value="generate">Generate Paychecks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="manage">
              <PayrollList />
            </TabsContent>
            <TabsContent value="generate">
              <PaycheckGeneration />
            </TabsContent>
            <TabsContent value="reports">
              <PayrollReporting />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
