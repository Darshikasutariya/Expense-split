import React, { useState } from "react";
import { groupAPI } from "../../api/groupAPI";

const AddGroupModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        groupName: '',
        groupDescription: '',
        groupType: 'trip'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await groupAPI.createGroup(formData);
            if (res.status === 201) {
                console.log("Group created successfully");
                await onSubmit(formData);
                setFormData({ groupName: '', groupDescription: '', groupType: 'trip' });
                onClose();
            }
        } catch (error) {
            console.error("Failed to create group", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-custom-ink-black">Create Group</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-custom-beige rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="e.g., Goa Trip 2026"
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
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
                            placeholder="What's this group for?"
                            rows={3}
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none resize-none"
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
                            className="w-full px-4 py-3 border border-custom-ash-grey/30 rounded-xl focus:ring-2 focus:ring-custom-dark-teal focus:border-transparent outline-none"
                        >
                            <option value="trip">Trip</option>
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="couple">Couple</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-custom-ash-grey/30 rounded-xl font-semibold text-custom-ink-black hover:bg-custom-beige transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-custom-dark-teal text-white rounded-xl font-semibold hover:bg-custom-ink-black transition-colors"
                        >
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddGroupModal;