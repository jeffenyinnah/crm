"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  CheckSquare,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/employees", label: "Employees", icon: Users },
    { href: "/dashboard/payroll", label: "Payroll", icon: DollarSign },
    { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
    { href: "#", label: "Tasks", icon: CheckSquare },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-gray-100 p-4 md:hidden">
        <h1 className="text-2xl font-bold">Aplo - CRM</h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <nav
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-full md:w-64 bg-gray-100 h-screen fixed top-0 left-0 transform transition-transform duration-200 ease-in-out z-50 shadow-lg md:translate-x-0`}
      >
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Aplo - CRM</h1>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-6 w-6" />
            </Button>
          )}
        </div>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center p-4 hover:bg-gray-200 transition-colors ${
                  pathname === link.href ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
