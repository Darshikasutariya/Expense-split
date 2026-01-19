import React, { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import UserAvatar from '../../components/common/UserAvatar';
import { friendAPI } from '../../api/friendAPI';
import { userAPI } from '../../api/userAPI';
import AddFriendModal from '../../components/models/AddFriendModal';
import ExpenseCard from '../../components/cards/ExpenseCard';
import { expenseAPI } from '../../api/expenseAPI';
import AddExpenseModal from '../../components/models/AddExpenseModel';
import ExpenseDetailsModal from '../../components/models/ExpenseDetailsModal';


const Friends = ({ friends, onAddFriend }) => {
    const { user } = useUser();
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);


    const getFriendDetails = (friend) => {
        return {
            name: friend.name || 'Unknown',
            email: friend.email,
            profilePicture: friend.profilePicture,
        };
    };

    const getExpensesList = async (friendId) => {
        try {
            const response = await expenseAPI.getFriendExpenses(friendId);
            const expenses = response?.data?.data?.expenses || [];
            setExpenses(expenses);
        } catch (err) {
            console.error("Fetch expenses failed", err);
            setExpenses([]);
        }
    };
    const handleFriendClick = async (friend) => {
        console.log("Friend clicked:", friend);
        setSelectedFriend(friend);
        await getExpensesList(friend.friendshipId);
    }
    const handleBack = () => {
        setSelectedFriend(null);
    }

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
                getExpensesList(selectedFriend.friendshipId);
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


    if (selectedFriend) {
        const friendDetails = getFriendDetails(selectedFriend);
        const onAddExpense = () => {
            setExpenseToEdit(null);
            setShowExpenseModal(true);
        }
        return (
            <>
                <div className="space-y-6">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-custom-dark-teal hover:text-custom-ink-black transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Friends
                    </button>

                    {/* Friend Header */}
                    <div className="bg-white rounded-2xl p-6 border border-custom-ash-grey/30">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <UserAvatar name={friendDetails.name} profilePicture={friendDetails.profilePicture} size="lg" />
                                <div>
                                    <h2 className="text-2xl font-bold text-custom-ink-black">{friendDetails.name}</h2>
                                    <p className="text-custom-air-force-blue">{friendDetails.email}</p>
                                    {/* <p className="text-xs text-custom-air-force-blue mt-1">
                                    Friends since {new Date(selectedFriend.acceptedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                </p> */}
                                </div>
                            </div>
                            <button
                                onClick={onAddExpense}
                                className="bg-custom-dark-teal text-white px-4 py-2 rounded-xl font-semibold hover:bg-custom-ink-black transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Expense
                            </button>
                        </div>
                    </div>

                    {/* Friend Expenses */}
                    <div className="bg-white rounded-2xl p-6 border border-custom-ash-grey/30">
                        <h3 className="text-lg font-bold text-custom-ink-black mb-4">Shared Expenses</h3>
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
                </div>

                {/* Add Expense Modal */}
                <AddExpenseModal
                    isOpen={showExpenseModal}
                    onClose={handleCloseExpenseModal}
                    onSuccess={() => {
                        setShowExpenseModal(false);
                        setExpenseToEdit(null);
                        getExpensesList(selectedFriend.friendshipId);
                    }}
                    defaultFriendId={selectedFriend.friendshipId}
                    expenseToEdit={expenseToEdit}
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
            </>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">

                <button
                    onClick={onAddFriend}
                    className="bg-custom-dark-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-custom-ink-black transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Friend
                </button>
            </div>
            {friends.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-custom-ash-grey">No friends found</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-6 border border-custom-ash-grey/30">
                    <h3 className="text-lg font-bold text-custom-ink-black mb-4">Your Friends</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {friends.map((friend) => {
                            const friendDetails = getFriendDetails(friend);
                            return (
                                <div
                                    key={friend._id}
                                    onClick={() => handleFriendClick(friend)}
                                    className="flex items-center gap-3 p-4 bg-custom-beige rounded-xl hover:bg-custom-ash-grey/30 transition-colors cursor-pointer"
                                >
                                    <UserAvatar name={friendDetails.name} profilePicture={friendDetails.profilePicture} size="md" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-custom-ink-black">{friendDetails.name}</p>
                                        {/* <p className="text-xs text-custom-air-force-blue">
                                        {friend.acceptedAt ? `Friends since ${new Date(friend.acceptedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : 'Friend'}
                                    </p> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Friends;