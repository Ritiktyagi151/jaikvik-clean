"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FaTrash,
  FaSearch,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaFileExport,
  FaChartLine,
  FaUsers,
  FaReply,
  FaCheck,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(...registerables);

interface ContactSubmission {
  id: string;
  fname: string;
  phone: string;
  email: string;
  subject: string;
  msg: string;
  createdAt: string;
  status: "new" | "in-progress" | "resolved" | "spam";
  tags: string[];
  assignedTo?: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [showFilters, setShowFilters] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newTag, setNewTag] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [activeTab, setActiveTab] = useState("submissions");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    submissions.forEach((sub) => sub.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [submissions]);

  const submissionsPerPage = 10;

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
        setTimeout(() => {
          // Mock submissions
          const mockSubmissions: ContactSubmission[] = Array.from(
            { length: 45 },
            (_, i) => ({
              id: `sub-${i + 1}`,
              fname: `User ${i + 1}`,
              phone: `+91-98765${Math.floor(10000 + Math.random() * 90000)}`,
              email: `user${i + 1}@example.com`,
              subject: `Inquiry about ${
                ["Product", "Service", "Support", "Partnership", "Feedback"][
                  i % 5
                ]
              }`,
              msg: `This is a sample message from user ${
                i + 1
              }. They are interested in learning more about our ${
                [
                  "products",
                  "services",
                  "support options",
                  "partnership opportunities",
                  "giving feedback",
                ][i % 5]
              }.`,
              createdAt: new Date(
                Date.now() -
                  Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
              ).toISOString(),
              status: ["new", "in-progress", "resolved", "spam"][
                Math.floor(Math.random() * 4)
              ] as ContactSubmission["status"],
              tags: Array.from(
                { length: Math.floor(Math.random() * 3) + 1 },
                () =>
                  ["urgent", "follow-up", "sales", "technical", "billing"][
                    Math.floor(Math.random() * 5)
                  ]
              ),
              assignedTo:
                Math.random() > 0.5
                  ? `member-${Math.floor(Math.random() * 3) + 1}`
                  : undefined,
            })
          );
          setSubmissions(mockSubmissions);

          // Mock team members
          const mockTeam: TeamMember[] = [
            {
              id: "member-1",
              name: "John Doe",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            {
              id: "member-2",
              name: "Jane Smith",
              avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            {
              id: "member-3",
              name: "Mike Johnson",
              avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            },
          ];
          setTeamMembers(mockTeam);

          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Search term filter
      const matchesSearch =
        sub.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.phone.includes(searchTerm) ||
        sub.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.msg.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        selectedStatus === "all" || sub.status === selectedStatus;

      // Tag filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => sub.tags.includes(tag));

      // Date filter
      const matchesDate =
        !startDate ||
        !endDate ||
        (new Date(sub.createdAt) >= new Date(startDate) &&
          new Date(sub.createdAt) <= new Date(endDate));

      return matchesSearch && matchesStatus && matchesTags && matchesDate;
    });
  }, [
    submissions,
    searchTerm,
    selectedStatus,
    selectedTags,
    startDate,
    endDate,
  ]);

  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = filteredSubmissions.slice(
    indexOfFirstSubmission,
    indexOfLastSubmission
  );
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter((sub) => sub.id !== id));
  };

  const handleStatusChange = (
    id: string,
    status: ContactSubmission["status"]
  ) => {
    setSubmissions(
      submissions.map((sub) => (sub.id === id ? { ...sub, status } : sub))
    );
  };

  const handleAssign = (id: string, memberId: string | undefined) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id ? { ...sub, assignedTo: memberId } : sub
      )
    );
  };

  const handleAddTag = (id: string) => {
    if (!newTag.trim()) return;
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id ? { ...sub, tags: [...sub.tags, newTag.trim()] } : sub
      )
    );
    setNewTag("");
  };

  const handleRemoveTag = (id: string, tagToRemove: string) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id
          ? { ...sub, tags: sub.tags.filter((tag) => tag !== tagToRemove) }
          : sub
      )
    );
  };

  const handleReply = () => {
    if (!selectedSubmission || !replyMessage.trim()) return;
    // In a real app, you would send the reply email here
    alert(`Reply sent to ${selectedSubmission.email}:\n\n${replyMessage}`);
    setReplyMessage("");
    setSelectedSubmission(null);
    // Mark as resolved
    handleStatusChange(selectedSubmission.id, "resolved");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusCounts = useMemo(() => {
    return submissions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [submissions]);

  const subjectCounts = useMemo(() => {
    return submissions.reduce((acc, sub) => {
      const subject = sub.subject.split("about")[1]?.trim() || sub.subject;
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [submissions]);

  const csvData = useMemo(() => {
    return filteredSubmissions.map((sub) => ({
      ID: sub.id,
      Name: sub.fname,
      Email: sub.email,
      Phone: sub.phone,
      Subject: sub.subject,
      Status: sub.status,
      Tags: sub.tags.join(", "),
      "Assigned To":
        teamMembers.find((m) => m.id === sub.assignedTo)?.name || "Unassigned",
      "Created At": formatDate(sub.createdAt),
      Message: sub.msg,
    }));
  }, [filteredSubmissions, teamMembers]);

  const statusColors: Record<ContactSubmission["status"], string> = {
    new: "bg-blue-600",
    "in-progress": "bg-yellow-600",
    resolved: "bg-green-600",
    spam: "bg-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-black py-4 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">
            Jaikvik Contact Admin
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "card" : "table")
              }
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {viewMode === "table" ? "Card View" : "Table View"}
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                      activeTab === "submissions"
                        ? "bg-red-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <FaEnvelope />
                    <span>Submissions</span>
                    <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded-full">
                      {submissions.length}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                      activeTab === "analytics"
                        ? "bg-red-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <FaChartLine />
                    <span>Analytics</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("team")}
                    className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                      activeTab === "team" ? "bg-red-600" : "hover:bg-gray-700"
                    }`}
                  >
                    <FaUsers />
                    <span>Team</span>
                  </button>
                </li>
              </ul>
            </nav>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Quick Filters
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedStatus("new")}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      selectedStatus === "new"
                        ? "bg-red-900 text-white"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    New ({statusCounts["new"] || 0})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedStatus("in-progress")}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      selectedStatus === "in-progress"
                        ? "bg-red-900 text-white"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    In Progress ({statusCounts["in-progress"] || 0})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedStatus("resolved")}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      selectedStatus === "resolved"
                        ? "bg-red-900 text-white"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    Resolved ({statusCounts["resolved"] || 0})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedStatus("spam")}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      selectedStatus === "spam"
                        ? "bg-red-900 text-white"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    Spam ({statusCounts["spam"] || 0})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                      selectedStatus === "all"
                        ? "bg-red-900 text-white"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    All ({submissions.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-10 space-y-6">
            {activeTab === "submissions" ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400">Total</h3>
                    <p className="text-2xl font-bold text-red-500">
                      {submissions.length}
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400">New</h3>
                    <p className="text-2xl font-bold text-blue-500">
                      {statusCounts["new"] || 0}
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400">In Progress</h3>
                    <p className="text-2xl font-bold text-yellow-500">
                      {statusCounts["in-progress"] || 0}
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400">Resolved</h3>
                    <p className="text-2xl font-bold text-green-500">
                      {statusCounts["resolved"] || 0}
                    </p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow">
                      <FaSearch className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search submissions..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md"
                      >
                        <FaFilter className="mr-2" />
                        Filters
                        {showFilters ? (
                          <FaChevronUp className="ml-2" />
                        ) : (
                          <FaChevronDown className="ml-2" />
                        )}
                      </button>
                      <CSVLink
                        data={csvData}
                        filename="contact-submissions.csv"
                        className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md"
                      >
                        <FaFileExport className="mr-2" />
                        Export
                      </CSVLink>
                    </div>
                  </div>

                  {showFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Date Range
                        </label>
                        <DatePicker
                          selectsRange={true}
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update) => setDateRange(update)}
                          isClearable={true}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() =>
                                setSelectedTags((prev) =>
                                  prev.includes(tag)
                                    ? prev.filter((t) => t !== tag)
                                    : [...prev, tag]
                                )
                              }
                              className={`text-xs px-2 py-1 rounded-full ${
                                selectedTags.includes(tag)
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Status
                        </label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="spam">Spam</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submissions Table/Cards */}
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4">Loading submissions...</p>
                  </div>
                ) : (
                  <>
                    {viewMode === "table" ? (
                      <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead className="bg-black">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  Tags
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  Assigned
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                              {currentSubmissions.length > 0 ? (
                                currentSubmissions.map((submission) => (
                                  <tr
                                    key={submission.id}
                                    className="hover:bg-gray-700 cursor-pointer"
                                    onClick={() =>
                                      setSelectedSubmission(submission)
                                    }
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-600 flex items-center justify-center">
                                          <FaUser className="text-white" />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-white">
                                            {submission.fname}
                                          </div>
                                          <div className="text-sm text-gray-400">
                                            {submission.email}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-white">
                                        {submission.subject}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <select
                                        value={submission.status}
                                        onChange={(e) =>
                                          handleStatusChange(
                                            submission.id,
                                            e.target
                                              .value as ContactSubmission["status"]
                                          )
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        className={`${
                                          statusColors[submission.status]
                                        } text-white text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white`}
                                      >
                                        <option
                                          value="new"
                                          className="bg-blue-600"
                                        >
                                          New
                                        </option>
                                        <option
                                          value="in-progress"
                                          className="bg-yellow-600"
                                        >
                                          In Progress
                                        </option>
                                        <option
                                          value="resolved"
                                          className="bg-green-600"
                                        >
                                          Resolved
                                        </option>
                                        <option
                                          value="spam"
                                          className="bg-gray-600"
                                        >
                                          Spam
                                        </option>
                                      </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex flex-wrap gap-1">
                                        {submission.tags.map((tag) => (
                                          <span
                                            key={tag}
                                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <select
                                        value={submission.assignedTo || ""}
                                        onChange={(e) =>
                                          handleAssign(
                                            submission.id,
                                            e.target.value || undefined
                                          )
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-gray-700 text-white text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white"
                                      >
                                        <option value="">Unassigned</option>
                                        {teamMembers.map((member) => (
                                          <option
                                            key={member.id}
                                            value={member.id}
                                          >
                                            {member.name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                      {formatDate(submission.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(submission.id);
                                        }}
                                        className="text-red-500 hover:text-red-400 mr-3"
                                      >
                                        <FaTrash />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={7}
                                    className="px-6 py-4 text-center text-gray-400"
                                  >
                                    No submissions found matching your criteria
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {filteredSubmissions.length > submissionsPerPage && (
                          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
                            <div className="flex-1 flex justify-between sm:hidden">
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-700"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                  )
                                }
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-700"
                              >
                                Next
                              </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm text-gray-400">
                                  Showing{" "}
                                  <span className="font-medium">
                                    {indexOfFirstSubmission + 1}
                                  </span>{" "}
                                  to{" "}
                                  <span className="font-medium">
                                    {Math.min(
                                      indexOfLastSubmission,
                                      filteredSubmissions.length
                                    )}
                                  </span>{" "}
                                  of{" "}
                                  <span className="font-medium">
                                    {filteredSubmissions.length}
                                  </span>{" "}
                                  results
                                </p>
                              </div>
                              <div>
                                <nav
                                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                  aria-label="Pagination"
                                >
                                  <button
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-600"
                                  >
                                    <span className="sr-only">Previous</span>←
                                  </button>
                                  {Array.from(
                                    { length: totalPages },
                                    (_, i) => (
                                      <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                          currentPage === i + 1
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-gray-700 text-gray-400 border-gray-700 hover:bg-gray-600"
                                        }`}
                                      >
                                        {i + 1}
                                      </button>
                                    )
                                  )}
                                  <button
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                      )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-600"
                                  >
                                    <span className="sr-only">Next</span>→
                                  </button>
                                </nav>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentSubmissions.length > 0 ? (
                          currentSubmissions.map((submission) => (
                            <div
                              key={submission.id}
                              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-600 flex items-center justify-center">
                                    <FaUser className="text-white" />
                                  </div>
                                  <div className="ml-3">
                                    <h3 className="text-white font-medium">
                                      {submission.fname}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                      {submission.email}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    statusColors[submission.status]
                                  }`}
                                >
                                  {submission.status}
                                </span>
                              </div>

                              <div className="mt-3">
                                <h4 className="text-white font-medium">
                                  {submission.subject}
                                </h4>
                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                  {submission.msg}
                                </p>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1">
                                {submission.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-3 flex justify-between items-center">
                                <div className="text-gray-400 text-sm flex items-center">
                                  <FaCalendarAlt className="mr-1" />
                                  {
                                    formatDate(submission.createdAt).split(
                                      ","
                                    )[0]
                                  }
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(submission.id);
                                    }}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-8 text-gray-400">
                            No submissions found matching your criteria
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : activeTab === "analytics" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Submissions by Status
                    </h3>
                    <div className="h-64">
                      <Pie
                        data={{
                          labels: Object.keys(statusCounts),
                          datasets: [
                            {
                              data: Object.values(statusCounts),
                              backgroundColor: [
                                "#3b82f6", // blue for new
                                "#eab308", // yellow for in-progress
                                "#22c55e", // green for resolved
                                "#64748b", // gray for spam
                              ],
                              borderWidth: 0,
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                color: "#f3f4f6",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Submissions by Subject
                    </h3>
                    <div className="h-64">
                      <Bar
                        data={{
                          labels: Object.keys(subjectCounts),
                          datasets: [
                            {
                              label: "Submissions",
                              data: Object.values(subjectCounts),
                              backgroundColor: "#ef4444", // red
                              borderWidth: 0,
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: "#374151",
                              },
                              ticks: {
                                color: "#9ca3af",
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: "#9ca3af",
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {submissions.slice(0, 5).map((sub) => (
                          <tr key={sub.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-600 flex items-center justify-center">
                                  <FaUser className="text-white" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    {sub.fname}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {sub.subject}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
                                Submitted form
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {formatDate(sub.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Team Members
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-gray-700 rounded-lg p-4 flex items-center"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="text-white font-medium">
                          {member.name}
                        </h3>
                        <p className="text-gray-400 text-sm">Support Agent</p>
                      </div>
                      <div className="ml-auto">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Performance Metrics
                  </h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-sm">
                          Tickets Resolved
                        </p>
                        <p className="text-2xl font-bold text-green-500">142</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-sm">
                          Avg. Response Time
                        </p>
                        <p className="text-2xl font-bold text-yellow-500">
                          2h 15m
                        </p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-sm">Customer Rating</p>
                        <p className="text-2xl font-bold text-blue-500">
                          4.8/5
                        </p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-sm">Active Tickets</p>
                        <p className="text-2xl font-bold text-red-500">18</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-red-500 mb-4">
                  Submission Details
                </h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="text-gray-400 text-sm">Name</p>
                      <p className="text-white">{selectedSubmission.fname}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{selectedSubmission.email}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white">{selectedSubmission.phone}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white flex items-center">
                        <FaCalendarAlt className="mr-2 text-red-500" />
                        {formatDate(selectedSubmission.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Subject</p>
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="text-white">{selectedSubmission.subject}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Message</p>
                    <div className="bg-gray-700 p-4 rounded whitespace-pre-wrap">
                      <p className="text-white">{selectedSubmission.msg}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-400 text-sm mb-2">Status</p>
                    <select
                      value={selectedSubmission.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedSubmission.id,
                          e.target.value as ContactSubmission["status"]
                        )
                      }
                      className={`${
                        statusColors[selectedSubmission.status]
                      } text-white text-sm px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-white`}
                    >
                      <option value="new" className="bg-blue-600">
                        New
                      </option>
                      <option value="in-progress" className="bg-yellow-600">
                        In Progress
                      </option>
                      <option value="resolved" className="bg-green-600">
                        Resolved
                      </option>
                      <option value="spam" className="bg-gray-600">
                        Spam
                      </option>
                    </select>
                  </div>

                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-400 text-sm mb-2">Assigned To</p>
                    <select
                      value={selectedSubmission.assignedTo || ""}
                      onChange={(e) =>
                        handleAssign(
                          selectedSubmission.id,
                          e.target.value || undefined
                        )
                      }
                      className="bg-gray-800 text-white text-sm px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      <option value="">Unassigned</option>
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-400 text-sm mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedSubmission.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() =>
                              handleRemoveTag(selectedSubmission.id, tag)
                            }
                            className="ml-1 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add new tag"
                        className="flex-grow bg-gray-800 text-white text-sm px-3 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        onClick={() => handleAddTag(selectedSubmission.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-r"
                      >
                        <FaTag />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-400 text-sm mb-2">Reply</p>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={4}
                      className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      onClick={handleReply}
                      className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center"
                    >
                      <FaReply className="mr-2" />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleStatusChange(selectedSubmission.id, "resolved");
                    setSelectedSubmission(null);
                  }}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  <FaCheck className="mr-2" />
                  Mark as Resolved
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
