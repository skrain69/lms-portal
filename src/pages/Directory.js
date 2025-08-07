import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const Directory = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const show = new URLSearchParams(search).get("directory") === "true";

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("directorySearch") || "");
  const [sortKey, setSortKey] = useState(localStorage.getItem("directorySortKey") || "name");
  const [sortOrder, setSortOrder] = useState(localStorage.getItem("directorySortOrder") || "asc");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const validUsers = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const isValid =
            data.name &&
            /^[A-Za-z]{2}$/.test(data.wireSign || "") &&
            (data.contact?.match(/\d/g) || []).length >= 11;

          if (isValid) {
            validUsers.push({
              id: doc.id,
              name: data.name,
              wireSign: data.wireSign,
              email: data.email,
              contact: data.contact,
            });
          }
        });

        setUsers(validUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Save search/sort to localStorage
  useEffect(() => {
    localStorage.setItem("directorySearch", searchTerm);
    localStorage.setItem("directorySortKey", sortKey);
    localStorage.setItem("directorySortOrder", sortOrder);
  }, [searchTerm, sortKey, sortOrder]);

  // Sort & filter
  const filteredUsers = users
    .filter((user) =>
      user.wireSign.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  // Sorting toggle
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Go to profile page
 const handleRowClick = (userId) => {
  navigate(`/profile/${userId}`);
};


  // Export features
  const handleCopy = () => {
    const text = filteredUsers
      .map((u) => `${u.name}\t${u.wireSign}\t${u.email}\t${u.contact}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Name", "Wire Sign", "Email", "Contact"]],
      body: filteredUsers.map((u) => [u.name, u.wireSign, u.email, u.contact]),
    });
    doc.save("directory.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Directory");
    XLSX.writeFile(workbook, "directory.xlsx");
  };

  // Render nothing if not in directory mode
  if (!show) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-gray-900 dark:text-gray-100">
      {/* Search */}
      <input
        type="text"
        placeholder="Search Wire Sign . . ."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 px-3 py-2 w-full max-w-md border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "📋 Copy", onClick: handleCopy },
          { label: "🧾 PDF", onClick: handleExportPDF },
          { label: "📊 Excel", onClick: handleExportExcel },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent hover:bg-blue-100 dark:hover:bg-blue-900 transition text-sm"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
            <tr>
              {["name", "wireSign", "email", "contact"].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:underline whitespace-nowrap"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                  {sortKey === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.wireSign}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.contact}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No matching users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Directory;
