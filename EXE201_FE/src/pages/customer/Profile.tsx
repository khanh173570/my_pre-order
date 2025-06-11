import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Profile: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="space-y-4">
          {" "}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Account Information</h2>{" "}
            <div className="space-y-3">
              <div>
                <label className="text-gray-600">Name:</label>
                <p className="font-medium">
                  {currentUser?.user?.name || currentUser?.userName}
                </p>
              </div>
              <div>
                <label className="text-gray-600">Email:</label>
                <p className="font-medium">{currentUser?.user?.email}</p>
              </div>
              <div>
                <label className="text-gray-600">Role:</label>
                <p className="font-medium">
                  {currentUser?.user?.role || currentUser?.roleName}
                </p>
              </div>
              <div>
                <label className="text-gray-600">User ID:</label>
                <p className="font-medium">{currentUser?.id}</p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Order History</h2>
            <p className="text-gray-600">No orders yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
