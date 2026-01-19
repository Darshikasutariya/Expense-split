import React, { useState, useEffect } from "react";
import GroupCard from "../../components/cards/GroupCard";
import { groupAPI } from "../../api/groupAPI";
import { expenseAPI } from "../../api/expenseAPI";
import ExpenseCard from "../../components/cards/ExpenseCard";
import AddExpenseModal from '../../components/models/AddExpenseModel';
import ManageGroupModal from '../../components/models/ManageGroupModal';
import ExpenseDetailsModal from '../../components/models/ExpenseDetailsModal';
import { useUser } from "../../context/UserContext";


const Groups = ({ groups, onCreateGroup, onGroupUpdate }) => {
    const { user } = useUser();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showManageGroupModal, setShowManageGroupModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const getExpensesList = async (groupId) => {
        try {
            const response = await expenseAPI.getGroupExpenses(groupId);
            const expenses = response?.data?.data || [];
            setExpenses(expenses);
        } catch (err) {
            console.error("Fetch expenses failed", err);
            setExpenses([]);
        }
    };
    const handleGroupClick = (group) => {
        console.log("Group clicked:", group);
        setSelectedGroup(group);
        getExpensesList(group._id);
    };

    useEffect(() => {
        if (selectedGroup) {
            const updatedGroup = groups.find(g => g._id === selectedGroup._id);
            if (updatedGroup) {
                setSelectedGroup(updatedGroup);
            }
        }
    }, [groups]);

    const handleBack = () => {
        setSelectedGroup(null);
        setShowMenu(false);
    }

    const handleDeleteGroup = async () => {
        if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;

        try {
            const res = await groupAPI.deleteGroup(selectedGroup._id);
            if (res.status === 200) {
                await onGroupUpdate();
                setSelectedGroup(null);
            }
        } catch (error) {
            console.error("Failed to delete group", error);
            alert("Failed to delete group");
        }
    };

    // Expense Actions
    const handleExpenseClick = (expense) => {
        setSelectedExpense(expense);
        setShowDetailsModal(true);
    };

    const handleEditExpense = (expense) => {
        setExpenseToEdit(expense);
        setShowDetailsModal(false);
        setShowExpenseModal(true);
    };

    const handleDeleteExpense = async (expense) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;

        try {
            const res = await expenseAPI.deleteExpense(expense._id);
            if (res.data.success) {
                setShowDetailsModal(false);
                getExpensesList(selectedGroup._id);
            }
        } catch (error) {
            console.error("Failed to delete expense", error);
            alert(error.response?.data?.message || "Failed to delete expense");
        }
    };

    const handleCloseExpenseModal = () => {
        setShowExpenseModal(false);
        setExpenseToEdit(null);
    };


    if (selectedGroup) {
        const isAdmin = user?._id === selectedGroup.createdBy;
        const onAddExpense = () => {
            setExpenseToEdit(null);
            setShowExpenseModal(true);
        }
        const onUpdateGroup = () => {
            setShowManageGroupModal(true);
        }
        return (
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-custom-dark-teal hover:text-custom-ink-black transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Groups
                </button>

                {/* Group Header */}
                <div className="bg-white rounded-2xl p-6 border border-custom-ash-grey/30">
                    <div className="flex items-start justify-between relative">
                        <div>
                            <h2 className="text-2xl font-bold text-custom-ink-black">{selectedGroup.groupName}</h2>
                            {selectedGroup.groupDescription && (
                                <p className="text-custom-air-force-blue mt-1">{selectedGroup.groupDescription}</p>
                            )}
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-custom-air-force-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-sm text-custom-air-force-blue">{selectedGroup.stats.memberCount} members</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-custom-air-force-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-custom-air-force-blue">₹{selectedGroup.stats.amount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onAddExpense}
                                className="bg-custom-dark-teal text-white px-4 py-2 rounded-xl font-semibold hover:bg-custom-ink-black transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Expense
                            </button>

                            <div className="flex items-center gap-2">
                                {/* Three Dot Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 hover:bg-custom-beige rounded-xl transition-colors text-custom-ink-black"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-custom-ash-grey/30 py-1 z-10">
                                            <button
                                                onClick={() => {
                                                    setShowManageGroupModal(true);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-custom-ink-black hover:bg-custom-beige hover:text-custom-dark-teal transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                {isAdmin ? "Edit Group" : "Group Members"}
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => {
                                                        handleDeleteGroup();
                                                        setShowMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete Group
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Group Expenses */}
                <div className="bg-white rounded-2xl p-6 border border-custom-ash-grey/30">
                    <h3 className="text-lg font-bold text-custom-ink-black mb-4">Group Expenses</h3>
                    {expenses.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {expenses.map((expense) => (
                                <ExpenseCard
                                    key={expense._id}
                                    expense={expense}
                                    onClick={() => handleExpenseClick(expense)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-custom-ash-grey mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-custom-air-force-blue">No expenses yet</p>
                            <button
                                onClick={onAddExpense}
                                className="mt-4 text-custom-dark-teal font-semibold hover:underline"
                            >
                                Add your first expense
                            </button>
                        </div>
                    )}
                </div>
                {/* Add Expense Modal */}
                <AddExpenseModal
                    isOpen={showExpenseModal}
                    onClose={handleCloseExpenseModal}
                    onSuccess={() => {
                        setShowExpenseModal(false);
                        setExpenseToEdit(null);
                        getExpensesList(selectedGroup._id);
                        onGroupUpdate();
                    }}
                    defaultGroupId={selectedGroup._id}
                    expenseToEdit={expenseToEdit}
                />

                {/* Manage Group Modal */}
                <ManageGroupModal
                    isOpen={showManageGroupModal}
                    onClose={() => setShowManageGroupModal(false)}
                    group={selectedGroup}
                    onUpdate={onUpdateGroup}
                />

                {/* Expense Details Modal */}
                <ExpenseDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    expense={selectedExpense}
                    currentUserId={user?._id}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                />
            </div>
        )
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={onCreateGroup}
                    className="bg-custom-dark-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-custom-ink-black transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Group
                </button>
            </div>
            {groups.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-custom-ash-grey">No groups found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <GroupCard key={group._id} group={group} onClick={() => handleGroupClick(group)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Groups;