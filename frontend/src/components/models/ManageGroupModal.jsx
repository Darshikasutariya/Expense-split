import React, { useState, useEffect } from "react";
import { groupAPI } from "../../api/groupAPI";
import { userAPI } from "../../api/userAPI";
import UserAvatar from "../common/UserAvatar";
import { useUser } from "../../context/UserContext";

const ManageGroupModal = ({ isOpen, onClose, group, onUpdate }) => {
    const { user: currentUser } = useUser();
    const [formData, setFormData] = useState({
        groupName: '',
        groupDescription: '',
        groupType: 'trip'
    });
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (group) {
            setFormData({
                groupName: group.groupName || '',
                groupDescription: group.groupDescription || '',
                groupType: group.groupType || 'trip'
            });
            setMembers(group.groupMembers || []);
        }
    }, [group]);

    const isAdmin = currentUser?._id === group?.createdBy;


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await userAPI.searchUser({ query });
            const users = response?.data?.data || [];
            const existingMemberIds = members.map(m => m.user_id?._id || m.user_id);
            const filteredUsers = users.filter(user => !existingMemberIds.includes(user._id));
            setSearchResults(filteredUsers);
        } catch (err) {
            console.error("Search user failed", err);
            setSearchResults([]);
        }
    };

    const handleAddMember = async (user) => {
        try {
            const res = await groupAPI.addMember(group._id, { user_id: user._id });
            if (res.status === 200) {
                setMembers(prev => [...prev, { user_id: user }]);
                setSearchQuery("");
                setSearchResults([]);
                alert("Member added successfully");
            }
        } catch (error) {
            console.error("Failed to add member", error);
            alert("Failed to add member");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            const res = await groupAPI.removeMember(group._id, { user_id: memberId });
            if (res.status === 200) {
                setMembers(prev => prev.filter(m => (m.user_id?._id || m.user_id) !== memberId));
            }
        } catch (error) {
            console.error("Failed to remove member", error);
            alert("Failed to remove member");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await groupAPI.updateGroup(group._id, formData);
            if (res.status === 200) {
                console.log("Group updated successfully");
                await onUpdate();
                onClose();
            }
        } catch (error) {
            console.error("Failed to update group", error);
            alert("Failed to update group");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !group) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-custom-ink-black">{isAdmin ? "Manage Group" : "Group Members"}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-custom-beige rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/*Group Informatio n*/}
                    {isAdmin && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                                    Group Name *
                                </label>
                                <input
                                    type="text"
                                    name="groupName"
                                    value={formData.groupName}
                                    onChange={handleChange}
                                    required
                                    disabled={!isAdmin}
                                    className={`w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="groupDescription"
                                    value={formData.groupDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    disabled={!isAdmin}
                                    className={`w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none resize-none ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-custom-air-force-blue mb-2">
                                    Group Type
                                </label>
                                <select
                                    name="groupType"
                                    value={formData.groupType}
                                    onChange={handleChange}
                                    disabled={!isAdmin}
                                    className={`w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    <option value="trip">Trip</option>
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="couple">Couple</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* group Members Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-custom-ink-black mb-3">Members</h3>

                        {/* Search add Member  */}
                        {isAdmin && (
                            <div className="mb-4 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Add person by name or email"
                                    className="w-full px-4 py-2 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none text-sm"
                                />
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-custom-ash-grey/30 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                                        {searchResults.map((user) => (
                                            <div
                                                key={user._id}
                                                className="flex items-center justify-between p-3 hover:bg-custom-beige cursor-pointer transition-colors"
                                                onClick={() => handleAddMember(user)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <UserAvatar name={user.name} profilePicture={user.profilePicture} size="sm" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-custom-ink-black">{user.name}</p>
                                                        <p className="text-xs text-custom-air-force-blue">{user.email}</p>
                                                    </div>
                                                </div>
                                                <button type="button" className="text-custom-dark-teal text-sm font-medium">Add</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Members List */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {members.map((member, index) => {
                                const user = member.user_id || member;
                                const isGroupAdmin = (user._id === group.createdBy);
                                return (
                                    <div key={user._id || index} className="flex items-center justify-between p-3 bg-custom-beige/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={user.name} profilePicture={user.profilePicture} size="sm" />
                                            <div>
                                                <p className="text-sm font-medium text-custom-ink-black flex items-center gap-2">
                                                    {user.name}
                                                    {isGroupAdmin && (
                                                        <span className="text-[10px] bg-custom-dark-teal text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                                            Admin
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-custom-air-force-blue">{user.email}</p>
                                            </div>
                                        </div>

                                        {isAdmin && !isGroupAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMember(user._id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Remove member"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    <div className="flex gap-3 pt-4 border-t border-custom-ash-grey/30">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-custom-ash-grey/30 rounded-xl font-semibold text-custom-ink-black hover:bg-custom-beige transition-colors"
                        >
                            {isAdmin ? "Cancel" : "Close"}
                        </button>
                        {isAdmin && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-custom-dark-teal text-white rounded-xl font-semibold hover:bg-custom-ink-black transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageGroupModal;
