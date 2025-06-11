import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  customerProfileService,
  UserProfile,
  UpdateProfileRequest,
} from "../../services/customer/profile.service";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await customerProfileService.getProfile();
      setProfile(profileData);
      setEditForm({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
    } catch (error) {
      toast.error("Không thể tải thông tin profile");
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = await customerProfileService.updateProfile(
        editForm
      );
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      toast.error("Không thể cập nhật thông tin");
      console.error("Error updating profile:", error);
    }
  };

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
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên
              </label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <textarea
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin tài khoản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tên
                  </label>
                  <p className="text-lg">{profile?.name || "Chưa cập nhật"}</p>
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
                    {profile?.role || "Chưa xác định"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Địa chỉ
                  </label>
                  <p className="text-lg">
                    {profile?.address || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Thông tin khác</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Ngày tạo tài khoản
                  </label>
                  <p className="text-lg">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                      : "Không xác định"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Cập nhật lần cuối
                  </label>
                  <p className="text-lg">
                    {profile?.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString("vi-VN")
                      : "Không xác định"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
