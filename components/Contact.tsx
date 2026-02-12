"use client";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Contact({ type }: { type: string }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleContact = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const description = formData.get("description");
    if (!name || !email || !description) {
      toast.error("Complete All the fields to submit");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post("/api/contact", { name, email, description,type });
      toast.success("Your form have been submitted successfully ");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error || "Failed to submit form");
      } else {
        toast.error(error.message || "Failed to submit form");
      }
    } finally {
      setIsSubmitting(false);
      e.target.reset();
    }
  };
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 text-base-content max-w-screen">
      <form className="card-body space-y-6" onSubmit={handleContact}>
        <div className="form-control w-full">
          <label className="label">Name</label>
          <input
            name="name"
            type="text"
            className="input outline-0 w-full"
            placeholder="Name"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label ">Email</label>
          <input
            name="email"
            type="email"
            className="input outline-0 w-full validator"
            placeholder="Email"
            required
          />
          <div className="validator-hint">Enter valid email address</div>
        </div>

        <div className="form-control w-full">
          <label className="label ">Description</label>
          <textarea
            name="description"
            placeholder="Describe your query..."
            className="textarea textarea-md w-full outline-0"
            minLength={25}
            required
          ></textarea>
        </div>

        <button
          className="btn btn-neutral mt-4"
          type="submit"
          disabled={isSubmitting}
        >
          {type==="submit"&&(!isSubmitting ? "Submit" : "Submitting...")}
          {type==="report"&&(!isSubmitting ? "Report" : "Reporting...")}
        </button>
      </form>
    </fieldset>
  );
}
