"use client";
import { useState, FormEvent } from "react";

function CustomerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      // Clear form or show success message
      setName("");
      setEmail("");
      setPhone("");
      alert("Customer added successfully!");
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Error adding customer. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <button type="submit">Add Customer</button>
    </form>
  );
}

export default CustomerForm;
