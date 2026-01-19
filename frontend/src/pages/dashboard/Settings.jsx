import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { userAPI } from "../../api/userAPI";

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser, error, setError } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notificationSetting, setNotificationSetting] = useState({
    push: true,
    email: true,
    inApp: true,
  });
  const [isNotificationChange, setIsNotificationChange] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    phoneno: user?.phoneno || "",
    profilePicture: user?.profilePicture,
  });

  //   const fetchUserProfile = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await userAPI.profile();
  //       if (response.data) {
  //         const userData = response.data.data;
  //         setUser(userData);
  //         setError(null);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch user profile:", err);
  //       const errorMessage =
  //         err.response?.data?.message || "Failed to load user data";
  //       setError(errorMessage);
  //       setUser(null);

  //       if (err.response?.status === 401) {
  //         console.error(
  //           "Authentication failed - User not found or token invalid"
  //         );
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = async () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      phoneno: user.phoneno || "",
      profilePicture: user.profilePicture,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userAPI.updateProfile(formData);
      if (response.data) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        setIsEditing(false);
        alert("Profile updated successfully!");
        console.log("Profile updated:", updatedUser);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to update profile. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await userAPI.deleteProfile();
      if (res.status === 200) {
        setShowDeleteDialog(false);
        alert("Account deleted successfully!");
        console.log("Account deleted:", res);
        navigate("/");
      }
    } catch (err) {
      console.error("Delete profile error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to delete profile. Please try again.";
      alert(errorMessage);
    }
  };

  const handleNotificationToggle = async (type) => {
    const newSetting = {
      ...notificationSetting,
      [type]: !notificationSetting[type],
    };
    setNotificationSetting(newSetting);
    try {
      setIsNotificationChange(true);
      await userAPI.updateNotification(newSetting);
      console.log("Notification settings updated successfully", newSetting);
    } catch (error) {
      alert("Failed to update notification settings.", error);
      setNotificationSetting(notificationSetting);
      console.log("Notification settings updated failed", notificationSetting);
      alert("Failed to update notification settings.");
    } finally {
      setIsNotificationChange(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Section */}
      <div className="bg-gradient-to-br from-custom-dark-teal to-custom-ink-black rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-medium">
              Change
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-white/80 mb-3">{user.email}</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                {user.role || "User"}
              </span>
              <span className="px-3 py-1 bg-green-500/30 backdrop-blur-sm rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-custom-ash-grey/20 overflow-hidden">
        <div className="bg-gradient-to-r from-custom-dark-teal/5 to-transparent px-8 py-6 border-b border-custom-ash-grey/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-custom-dark-teal/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-custom-dark-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-custom-ink-black">
                  Account Information
                </h3>
                <p className="text-sm text-custom-air-force-blue">
                  {isEditing
                    ? "Update your personal details"
                    : "Your personal information"}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="px-6 py-2.5 bg-custom-dark-teal text-white rounded-xl font-semibold hover:bg-custom-ink-black transition-all shadow-lg shadow-custom-dark-teal/20 hover:shadow-xl hover:shadow-custom-ink-black/20 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-custom-ink-black mb-2">
                Full Name {isEditing && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={isEditing}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${isEditing
                  ? "border-custom-ash-grey/30 focus:ring-2 focus:ring-custom-dark-teal/20 focus:border-custom-dark-teal"
                  : "border-custom-ash-grey/20 bg-gray-50 text-custom-air-force-blue cursor-not-allowed"
                  }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-custom-ink-black mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneno"
                value={formData.phoneno}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+91 1234567890"
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${isEditing
                  ? "border-custom-ash-grey/30 focus:ring-2 focus:ring-custom-dark-teal/20 focus:border-custom-dark-teal"
                  : "border-custom-ash-grey/20 bg-gray-50 text-custom-air-force-blue cursor-not-allowed"
                  }`}
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-custom-ink-black mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full px-4 py-3 border-2 border-custom-ash-grey/20 rounded-xl bg-gray-50 text-custom-air-force-blue outline-none cursor-not-allowed"
                readOnly
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-custom-air-force-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-custom-air-force-blue mt-2 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Email address cannot be changed for security reasons
            </p>
          </div>

          {/* Save/Cancel Buttons - Only show when editing */}
          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-custom-dark-teal/20 ${isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-custom-dark-teal text-white hover:bg-custom-ink-black hover:shadow-xl hover:shadow-custom-ink-black/20 transform hover:-translate-y-0.5"
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={isLoading}
                className="px-6 py-3 rounded-xl font-semibold border-2 border-custom-ash-grey/30 text-custom-air-force-blue hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-custom-ash-grey/20 overflow-hidden">
        <div className="bg-gradient-to-r from-custom-dark-teal/5 to-transparent px-8 py-6 border-b border-custom-ash-grey/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-custom-dark-teal/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-custom-dark-teal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-custom-ink-black">
                Notification Preferences
              </h3>
              <p className="text-sm text-custom-air-force-blue">
                Choose how you want to be notified
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-custom-ink-black mb-1">
                  Push Notifications
                </p>
                <p className="text-sm text-custom-air-force-blue">
                  Receive push notifications on your device
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSetting?.push || false}
                onChange={() => handleNotificationToggle("push")}
                disabled={isNotificationChange}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-custom-dark-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-custom-dark-teal shadow-inner"></div>
            </label>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-custom-ink-black mb-1">
                  Email Notifications
                </p>
                <p className="text-sm text-custom-air-force-blue">
                  Receive email updates about your expenses
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSetting?.email || false}
                onChange={() => handleNotificationToggle("email")}
                disabled={isNotificationChange}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-custom-dark-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-custom-dark-teal shadow-inner"></div>
            </label>
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-custom-ink-black mb-1">
                  In-App Notifications
                </p>
                <p className="text-sm text-custom-air-force-blue">
                  Show notifications within the app
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSetting?.inApp || false}
                onChange={() => handleNotificationToggle("inApp")}
                disabled={isNotificationChange}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-custom-dark-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-custom-dark-teal shadow-inner"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between p-6 rounded-xl border-2 border-red-100 bg-red-50/50">
            <div>
              <p className="font-semibold text-custom-ink-black mb-1">
                Delete Account
              </p>
              <p className="text-sm text-custom-air-force-blue">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-600/30 transform hover:-translate-y-0.5"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-5 border-b border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-custom-ink-black mb-4">
                Are you absolutely sure you want to delete your account?
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠️ Warning:
                </p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>All your personal data will be permanently deleted</li>
                  <li>All your expenses and groups will be removed</li>
                  <li>This action is irreversible</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 hover:shadow-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Settings;
