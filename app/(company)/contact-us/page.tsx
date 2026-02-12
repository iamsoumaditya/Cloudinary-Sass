import React from "react";
import Contact from "@/components/Contact";

export default function ConatctUsPage() {
  return (
    <div className="min-h-screen bg-base-100 container mx-auto p-4 max-w-full">
      <h1 className="text-3xl text-base-content font-bold mb-6 text-center">
        Contact Us
      </h1>

      <div className="card">
          <Contact type="submit"/>
      </div>
    </div>
  );
}
