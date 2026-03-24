"use client";

import { useState } from "react";
import type { EnquireFormInterface } from "../../interfaces/EnquireFormInterface";
import "../../styles/enquire-form.css";

const EnquireSection = () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<EnquireFormInterface>({
    fname: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    city: "",
    state: "", // Added state
    preferredDate: "",
    preferredTime: "",
    preferredMode: "", // Added preferredMode
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
    meetLink?: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (formData.preferredDate < today) {
        throw new Error("Preferred date cannot be in the past.");
      }
      if (!timePattern.test(formData.preferredTime)) {
        throw new Error("Please enter a valid preferred time.");
      }
      if (!API_BASE) {
        throw new Error("Form service is unavailable. Please try again later.");
      }

      const response = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sourcePage: "home-enquiry",
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: data.message || "Your enquiry has been submitted successfully!",
          meetLink: data?.meeting?.meetLink,
        });
        // Reset form
        setFormData({
          fname: "",
          email: "",
          phone: "",
          company: "",
          message: "",
          city: "",
          state: "",
          preferredDate: "",
          preferredTime: "",
          preferredMode: "",
        });
      } else {
        throw new Error(data?.message || "Failed to submit enquiry");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="schedule-your-meeting"
      className="px-4 py-6 sm:px-7 sm:py-7 md:px-8 md:py-8 lg:px-10 lg:py-10"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
        {/* Enquiry Form */}
        <div className="w-full">
          <div className="flex flex-col w-full min-h-[320px] sm:min-h-[340px]">
            <form onSubmit={handleSubmit}>
              {/* Status Message */}
              {submitStatus && (
                <div
                  className={`mb-4 p-3 rounded ${
                    submitStatus.success
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                  {submitStatus.meetLink && (
                    <div className="mt-2">
                      Meeting Link:{" "}
                      <a
                        href={submitStatus.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {submitStatus.meetLink}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-3 lg:gap-4">
                <div className="col-span-2 flex items-center">
                  <h2 className="uppercase text-white text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">
                    Schedule Your Meeting
                  </h2>
                </div>

                {/* Full Name */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="text"
                      id="fname"
                      name="fname"
                      value={formData.fname}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      autoComplete="off"
                      className="w-full"
                    />
                    <label htmlFor="fname" className="placeholder-text">FULL NAME</label>
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      autoComplete="off"
                      className="w-full"
                    />
                    <label htmlFor="email" className="placeholder-text">EMAIL ADDRESS</label>
                  </div>
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="w-full"
                    />
                    <label htmlFor="phone" className="placeholder-text">PHONE NUMBER</label>
                  </div>
                </div>

                {/* Company Name */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="w-full"
                    />
                    <label htmlFor="company" className="placeholder-text">COMPANY NAME</label>
                  </div>
                </div>

                {/* City */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="w-full"
                    />
                    <label htmlFor="city" className="placeholder-text">CITY</label>
                  </div>
                </div>

                {/* State (Added) */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="w-full"
                    />
                    <label htmlFor="state" className="placeholder-text">STATE</label>
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={today}
                      required
                      className="w-full"
                    />
                    <label htmlFor="preferredDate" className="placeholder-text">PREFERRED DATE</label>
                  </div>
                </div>

                {/* Preferred Time */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="time"
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                    <label htmlFor="preferredTime" className="placeholder-text">PREFERRED TIME</label>
                  </div>
                </div>

                {/* Preferred Mode (Added instead of Location) */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <input
                      type="text"
                      id="preferredMode"
                      name="preferredMode"
                      value={formData.preferredMode}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      list="mode-options"
                      className="w-full"
                    />
                    <datalist id="mode-options">
                      <option value="Online Meeting" />
                      <option value="Office Visit" />
                      <option value="Phone Call" />
                      <option value="Google Meet" />
                    </datalist>
                    <label htmlFor="preferredMode" className="placeholder-text">PREFERRED MODE</label>
                  </div>
                </div>

                {/* Message */}
                <div className="sm:col-span-1">
                  <div className="input-contain">
                    <textarea
                      id="message"
                      name="message"
                      rows={1}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="w-full"
                    ></textarea>
                    <label htmlFor="message" className="placeholder-text">MESSAGE</label>
                  </div>
                </div>

                {/* Submit */}
                <div className="col-span-2">
                  <div className="flex justify-center mt-4 sm:mt-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-main-red text-white font-semibold py-2 px-6 w-full sm:w-auto border-none hover:scale-95 transition-transform duration-300 ease-in-out ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "SENDING..." : "SEND NOW"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Location Map */}
        <div className="w-full">
          <div className="w-full h-full min-h-[300px] sm:min-h-[340px] md:min-h-[320px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14000.000000000002!2d77.0000000!3d28.0000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="absolute inset-0 w-full h-full border border-gray-300 rounded"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquireSection;