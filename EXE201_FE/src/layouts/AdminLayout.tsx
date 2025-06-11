import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
