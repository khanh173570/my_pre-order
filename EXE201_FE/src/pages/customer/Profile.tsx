import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { fetchUserProfile } from "../../services/profile.service";
import { User } from "../../types";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { isAuthenticated, userProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      // If we already have user profile in context, use it
      if (userProfile) {
        console.log("Using profile from context:", userProfile);
        setProfile(userProfile);
        setIsLoading(false);
        return;
      }

      // Otherwise fetch it
      console.log("Fetching profile directly");
      const profileData = await fetchUserProfile();

      if (profileData) {
        setProfile(profileData);
      } else {
        toast.error("Không thể tải thông tin profile");
      }
    } catch (error) {
      toast.error("Không thể tải thông tin profile");
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userProfile]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tên</label>
                <p className="text-lg">
                  {profile
                    ? `${profile.firstName} ${profile.lastName}`
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-lg">{profile?.email || "Chưa cập nhật"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </label>
                <p className="text-lg">{profile?.phone || "Chưa cập nhật"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Vai trò
                </label>
                <p className="text-lg capitalize">
                  {profile?.roles?.join(", ") || "Chưa xác định"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
