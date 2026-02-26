"use client";

import { useState } from "react";
import "../../styles/enquire-form.css";

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/info@jaikviktechnology.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _template: "table",
            _captcha: "false",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Message sent successfully!",
        });
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="relative">
          <div className="input-contain">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              required
              autoComplete="off"
              aria-label="Full Name"
            />
            <label htmlFor="name" className="placeholder-text">
              FULL NAME
            </label>
          </div>
        </div>

        {/* Phone Field */}
        <div className="relative">
          <div className="input-contain">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder=" "
              required
              autoComplete="off"
              aria-label="Phone Number"
            />
            <label htmlFor="phone" className="placeholder-text">
              PHONE NUMBER
            </label>
          </div>
        </div>

        {/* Email Field */}
        <div className="relative md:col-span-2">
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
              aria-label="Email Address"
            />
            <label htmlFor="email" className="placeholder-text">
              EMAIL ADDRESS
            </label>
          </div>
        </div>

        {/* Subject Field */}
        <div className="relative md:col-span-2">
          <div className="input-contain">
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder=" "
              autoComplete="off"
              aria-label="Subject"
            />
            <label htmlFor="subject" className="placeholder-text">
              Your Subject
            </label>
          </div>
        </div>

        {/* Message Field */}
        <div className="md:col-span-2">
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            autoComplete="off"
            className="w-full border border-white px-4 py-3 bg-transparent text-white focus:border-red-600 focus:outline-none placeholder-white"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-red-600 text-white py-2 px-4 font-semibold hover:scale-90 transition-transform duration-300 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
