import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignedIn, UserButton, SignOutButton, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            <span className="text-2xl font-bold">Aplo-CRM</span>
          </div>
          <div className="flex items-center space-x-2">
            <SignedIn>
              <Button variant="ghost" className="hidden sm:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button variant="default">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </SignedOut>
          </div>
        </header>

        <main className="space-y-24">
          <section className="text-center space-y-8">
            <div className="inline-block">
              <div className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>New Features Available</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              Streamline Your Business
              <br />
              with Aplo-CRM
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solution for Employee Management, Invoice
              Management, and Payroll Management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Link href="/sign-in">Get Started Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Contact Us
              </Button>
            </div>
          </section>
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-8">See Aplo-CRM in action</h2>
            <div className="bg-gray-200 rounded-lg p-4 max-w-3xl mx-auto">
              <img
                src="/crm.png"
                alt="Aplo-CRM"
                className="rounded-md shadow-md"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Employee Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Efficiently manage your workforce with our comprehensive
                  employee management tools.
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    Profiles
                  </Button>
                  <Button variant="outline" size="sm">
                    Performance
                  </Button>
                  <Button variant="outline" size="sm">
                    Scheduling
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Invoice Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Streamline your billing process with our intuitive invoice
                  management system.
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    Create
                  </Button>
                  <Button variant="outline" size="sm">
                    Track
                  </Button>
                  <Button variant="outline" size="sm">
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Payroll Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Simplify your payroll process with our automated payroll
                  management solution.
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    Calculate
                  </Button>
                  <Button variant="outline" size="sm">
                    Distribute
                  </Button>
                  <Button variant="outline" size="sm">
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Data Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gain valuable insights with our powerful data analytics and
                  reporting tools.
                </p>
                <Button className="mt-4" variant="outline">
                  Explore Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Integration & API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Seamlessly integrate with your existing tools and systems
                  using our robust API.
                </p>
                <Button className="mt-4" variant="outline">
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get round-the-clock assistance from our dedicated support
                  team.
                </p>
                <Button className="mt-4" variant="outline">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to transform your business?
            </h2>
            <p className="mb-8 text-lg">
              Join thousands of satisfied customers and take your business to
              the next level.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </section>
        </main>

        <footer className="mt-24 text-center text-gray-500">
          <p>© 2024 Aplo-CRM. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
