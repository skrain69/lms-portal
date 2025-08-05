// AdminPanel.js - Clean Version with Role Control and Delete

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const changeRole = async (id, newRole) => {
    if (id === currentUser.uid && newRole === "employee") {
      alert("You cannot demote your own role.");
      return;
    }
    await updateDoc(doc(db, "users", id), { role: newRole });
    fetchEmployees();
  };

  const removeEmployee = async (id) => {
    if (id === currentUser.uid) {
      alert("You cannot delete your own account.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;
    await deleteDoc(doc(db, "users", id));
    fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 underline mb-4"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Admin Panel - Manage Users</h1>

      <ul className="space-y-4">
        {employees.map(emp => (
          <li
            key={emp.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{emp.email}</p>
              <p className="text-sm">
                Role: <span className={`inline-block px-2 py-0.5 rounded text-white ${emp.role === 'admin' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  {emp.role}
                </span>
              </p>
            </div>

            <div className="space-x-2">
              {emp.role === "employee" && (
                <button
                  onClick={() => changeRole(emp.id, "admin")}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Promote to Admin
                </button>
              )}
              {emp.role === "admin" && emp.id !== currentUser.uid && (
                <button
                  onClick={() => changeRole(emp.id, "employee")}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Demote to Employee
                </button>
              )}
              {emp.id !== currentUser.uid && (
                <button
                  onClick={() => removeEmployee(emp.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;