"use client";

import { useState } from "react";
import type { EnquireFormInterface } from "../../interfaces/EnquireFormInterface";
import "../../styles/enquire-form.css";
const EnquireSection = () => {
  const [formData, setFormData] = useState<EnquireFormInterface>({
    fname: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    city: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            name: formData.fname,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            message: formData.message,
            city: formData.city,
            _subject: "New Enquiry Form Submission",
            _template: "table",
            _captcha: "false",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Your enquiry has been submitted successfully!",
        });
        // Reset form
        setFormData({
          fname: "",
          email: "",
          phone: "",
          company: "",
          message: "",
          city: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit enquiry");
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
    <section className="px-4 py-6 sm:px-7 sm:py-7 md:px-8 md:py-8 lg:px-10 lg:py-10">
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
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-3 lg:gap-4">
                {/* Heading */}
                <div className="col-span-2 flex items-center">
                  <h2 className="uppercase text-white text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">
                    Enquiry Form
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
                      aria-label="Full Name"
                      className="w-full"
                    />
                    <label htmlFor="fname" className="placeholder-text">
                      FULL NAME
                    </label>
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
                      aria-label="Email Address"
                      className="w-full"
                    />
                    <label htmlFor="email" className="placeholder-text">
                      EMAIL ADDRESS
                    </label>
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
                      autoComplete="off"
                      aria-label="Phone Number"
                      className="w-full"
                    />
                    <label htmlFor="phone" className="placeholder-text">
                      PHONE NUMBER
                    </label>
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
                      autoComplete="off"
                      aria-label="Company Name"
                      className="w-full"
                    />
                    <label htmlFor="company" className="placeholder-text">
                      COMPANY NAME
                    </label>
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
                      autoComplete="off"
                      aria-label="City"
                      className="w-full"
                    />
                    <label htmlFor="city" className="placeholder-text">
                      CITY
                    </label>
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
                      aria-label="Message"
                      className="w-full"
                    ></textarea>
                    <label htmlFor="message" className="placeholder-text">
                      MESSAGE
                    </label>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.728679471876!2d77.3799222!3d28.6208897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef6105705e55%3A0xe206b5e4f7fd200c!2sJaikvik%20Technology%20India%20Pvt.%20Ltd.!5e1!3m2!1sen!2sin!4v1747125883950!5m2!1sen!2sin"
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
