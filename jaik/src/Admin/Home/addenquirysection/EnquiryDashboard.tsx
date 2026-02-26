"use client";

import { useState, useEffect } from "react";
import type { AdminEnquiryInterface } from "../../../interfaces/EnquireFormInterface";

const EnquiryDashboard = () => {
  // State management
  const [enquiries, setEnquiries] = useState<AdminEnquiryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] =
    useState<AdminEnquiryInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState("");
  const itemsPerPage = 10;

  // Mock data fetch
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockData: AdminEnquiryInterface[] = Array.from(
          { length: 25 },
          (_, i) => ({
            id: `enq-${i + 1}`,
            fname: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            company: `Company ${
              i % 5 === 0 ? "Inc" : i % 3 === 0 ? "LLC" : "Ltd"
            }`,
            message: `I'm interested in your services regarding ${
              ["web development", "consulting", "design", "support"][i % 4]
            }.`,
            city: ["New York", "London", "Tokyo", "Sydney", "Berlin"][i % 5],
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
            ),
            status: ["pending", "reviewed", "resolved"][
              Math.floor(Math.random() * 3)
            ] as AdminEnquiryInterface["status"],
            notes:
              i % 4 === 0
                ? `Previous contact on ${new Date().toLocaleDateString()}`
                : undefined,
          })
        );

        setEnquiries(mockData);
      } catch (err) {
        setError("Failed to fetch enquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Filter and pagination logic
  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  // Status update handler
  const handleStatusUpdate = (
    id: string,
    newStatus: AdminEnquiryInterface["status"]
  ) => {
    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
      )
    );
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  // Notes submission handler
  const handleNotesSubmit = (id: string) => {
    if (!notes.trim()) return;

    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, notes } : enquiry
      )
    );

    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, notes } : null));
    }

    setNotes("");
  };

  // Stats calculation
  const stats = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    reviewed: enquiries.filter((e) => e.status === "reviewed").length,
    resolved: enquiries.filter((e) => e.status === "resolved").length,
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-300">Loading enquiries...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-center w-12 h-12 bg-red-900 rounded-full mb-4">
          <span className="text-red-500 text-xl font-bold">!</span>
        </div>
        <p className="text-red-500 mb-4 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-6">
      {/* Header Section */}
      <header className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-red-600">ENQUIRY</span>
            <span className="text-gray-300"> DASHBOARD</span>
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <span className="block text-2xl font-bold text-white">
                {stats.total}
              </span>
              <span className="text-gray-400">Total</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-red-900">
              <span className="block text-2xl font-bold text-red-500">
                {stats.pending}
              </span>
              <span className="text-gray-400">Pending</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <span className="block text-2xl font-bold text-white">
                {stats.reviewed}
              </span>
              <span className="text-gray-400">Reviewed</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <span className="block text-2xl font-bold text-white">
                {stats.resolved}
              </span>
              <span className="text-gray-400">Resolved</span>
            </div>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white placeholder-gray-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-white"
          >
            <option value="all" className="bg-gray-800">
              All Statuses
            </option>
            <option value="pending" className="bg-gray-800">
              Pending
            </option>
            <option value="reviewed" className="bg-gray-800">
              Reviewed
            </option>
            <option value="resolved" className="bg-gray-800">
              Resolved
            </option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
              />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Enquiry List */}
        <div className="flex-1 bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {paginatedEnquiries.length > 0 ? (
                  paginatedEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      className={`hover:bg-gray-800 ${
                        enquiry.status === "pending"
                          ? "bg-gray-900"
                          : enquiry.status === "reviewed"
                          ? "bg-gray-900"
                          : "bg-gray-900"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {enquiry.fname}
                          </span>
                          <span className="text-sm text-gray-400">
                            {enquiry.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {enquiry.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {enquiry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {new Date(enquiry.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={enquiry.status}
                          onChange={(newStatus) =>
                            handleStatusUpdate(enquiry.id, newStatus)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="text-red-500 hover:text-red-400 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No enquiries found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-800 bg-gray-800">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === pageNum
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 text-gray-400">...</span>
                )}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-10 h-10 rounded-md ${
                      currentPage === totalPages
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Enquiry Detail Panel */}
        {selectedEnquiry && (
          <div className="lg:w-96 bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
            <div className="flex justify-between items-center bg-gray-800 px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                Enquiry Details
              </h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-xl text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="Full Name" value={selectedEnquiry.fname} />
                  <DetailItem label="Email" value={selectedEnquiry.email} />
                  <DetailItem label="Phone" value={selectedEnquiry.phone} />
                  <DetailItem label="Company" value={selectedEnquiry.company} />
                  <DetailItem
                    label="City"
                    value={selectedEnquiry.city || "N/A"}
                  />
                  <DetailItem
                    label="Date Submitted"
                    value={new Date(selectedEnquiry.createdAt).toLocaleString()}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">
                  Message
                </h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">
                  Management
                </h3>
                <div className="space-y-4">
                  <StatusBadge
                    status={selectedEnquiry.status}
                    onChange={(newStatus) =>
                      handleStatusUpdate(selectedEnquiry.id, newStatus)
                    }
                    large
                  />

                  <div className="space-y-2">
                    <label
                      htmlFor="enquiry-notes"
                      className="block text-sm font-medium text-gray-400"
                    >
                      Internal Notes
                    </label>
                    <textarea
                      id="enquiry-notes"
                      value={notes || selectedEnquiry.notes || ""}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this enquiry..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-red-600 focus:border-red-600 text-white"
                      rows={4}
                    />
                    <button
                      onClick={() => handleNotesSubmit(selectedEnquiry.id)}
                      disabled={!notes && !selectedEnquiry.notes}
                      className={`w-full px-4 py-2 rounded-md ${
                        !notes && !selectedEnquiry.notes
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({
  status,
  onChange,
  large = false,
}: {
  status: AdminEnquiryInterface["status"];
  onChange: (newStatus: AdminEnquiryInterface["status"]) => void;
  large?: boolean;
}) => {
  const statusClasses = {
    pending: "bg-red-900/30 text-red-500 border-red-900",
    reviewed: "bg-blue-900/30 text-blue-400 border-blue-900",
    resolved: "bg-green-900/30 text-green-400 border-green-900",
  };

  return (
    <select
      value={status}
      onChange={(e) =>
        onChange(e.target.value as AdminEnquiryInterface["status"])
      }
      className={`${statusClasses[status]} ${
        large ? "px-4 py-2 text-base" : "px-2 py-1 text-sm"
      } rounded-md font-medium border focus:outline-none focus:ring-2 ${
        status === "pending"
          ? "focus:ring-red-600"
          : status === "reviewed"
          ? "focus:ring-blue-600"
          : "focus:ring-green-600"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="reviewed">Reviewed</option>
      <option value="resolved">Resolved</option>
    </select>
  );
};

// Detail Item Component
const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center">
    <span className="text-sm font-medium text-gray-500 sm:w-1/3">{label}</span>
    <span className="mt-1 sm:mt-0 sm:w-2/3 text-white">{value}</span>
  </div>
);

export default EnquiryDashboard;
