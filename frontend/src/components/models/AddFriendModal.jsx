import React, { useState } from "react";
import { friendAPI } from "../../api/friendAPI";
import { userAPI } from "../../api/userAPI";
import { data } from "react-router-dom";

const AddFriendModal = ({ isOpen, onClose, onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      const response = await userAPI.searchUser({ query });
      const users = response?.data?.data || [];
      setSearchResults(users);
    } catch (err) {
      console.error("Search user failed", err);
      setSearchResults([]);
    }
  };

  const handleSendRequest = async (user) => {
    try {
      const res = await friendAPI.sendFriendRequest(user._id, {});
      if (res.status === 200) {
        console.log("Friend request sent:", res.data);
        alert("Friend request sent successfully");
        onSubmit(user);
        setSearchQuery("");
        setSearchResults([]);
        onClose();
      } 
    } catch (err) {
      console.error("Send friend request failed", err);
      alert(err?.response?.data?.message || "Failed to send friend request");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-custom-ink-black">
            Add Friend
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-custom-beige rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
              Search by name or email
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Enter name or email"
              className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-custom-beige rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-custom-ink-black">
                      {user.name}
                    </p>
                    <p className="text-sm text-custom-air-force-blue">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSendRequest(user)}
                    className="px-4 py-2 bg-custom-dark-teal text-white rounded-lg font-semibold hover:bg-custom-ink-black transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-custom-air-force-blue">No users found</p>
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 mx-auto text-custom-ash-grey mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-custom-air-force-blue">
                Search for users to add as friends
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
