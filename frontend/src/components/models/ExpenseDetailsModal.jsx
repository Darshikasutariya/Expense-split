import React from 'react';
import UserAvatar from '../common/UserAvatar';
import CategoryIcon from '../common/CategoryIcon';
import AmountDisplay from '../common/AmountDisplay';

const ExpenseDetailsModal = ({ isOpen, onClose, expense, onEdit, onDelete, currentUserId }) => {
    if (!isOpen || !expense) return null;

    const {
        title,
        description,
        amount,
        category,
        paid_by,
        split_among,
        createdAt,
        expense_type,
        group_id,
        friend_id
    } = expense;

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Permission Logic
    // For groups: check if user is in the group (backend validation is primary, this is UI only)
    // For friends: check if user is part of the friendship
    // Assuming 'currentUserId' is passed and available.
    // However, existing backend logic suggests:
    // Group: Must be a member.
    // Friend: Must be one of the friends.
    // Since 'expense' object might not contain full user lists for permission checking,
    // we rely on the parent component or assume if they can see it, they might be able to edit it
    // BUT we should ideally check permissions.
    // For now, valid members can see buttons, actual authorization is on backend.

    const canEdit = true; // Simplified for now, can refine with exact props if needed.
    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
                <div className="flex items-center justify-between p-4 border-b border-custom-ash-grey/30 sticky top-0 bg-white z-10">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-custom-beige rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-custom-ink-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {canEdit && (
                        <button
                            onClick={() => onEdit(expense)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-custom-beige text-custom-dark-teal rounded-lg font-semibold text-sm hover:bg-custom-dark-teal hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* Main Info */}
                    <div className="text-center">
                        <div className="inline-block p-3 bg-custom-beige rounded-2xl mb-3">
                            <CategoryIcon category={category} size="lg" />
                        </div>
                        <h2 className="text-2xl font-bold text-custom-ink-black mb-1">{title}</h2>
                        <AmountDisplay amount={amount} size="2xl" className="justify-center" />
                        <p className="text-xs text-custom-air-force-blue mt-2">
                            Added on {formatDate(createdAt)}
                        </p>
                    </div>

                    {description && (
                        <div className="bg-gray-50 p-3 rounded-xl text-center text-sm text-custom-ink-black">
                            <p>"{description}"</p>
                        </div>
                    )}

                    <div className="border-t border-b border-custom-ash-grey/30 py-4 space-y-4">
                        {/* Paid By */}
                        <div>
                            <h3 className="text-sm font-semibold text-custom-air-force-blue mb-3 uppercase tracking-wider">Paid By</h3>
                            <div className="space-y-3">
                                {paid_by.map((payer, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                name={payer.user_id?.name || 'User'}
                                                profilePicture={payer.user_id?.profilePicture}
                                                size="sm"
                                            />
                                            <span className="font-medium text-custom-ink-black text-sm">
                                                {payer.user_id?.name || 'Unknown User'}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-custom-dark-teal text-sm">
                                            ₹{payer.amount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Split Among */}
                        <div>
                            <div className="flex items-center justify-between mb-3 pt-4 border-t border-custom-ash-grey/30">
                                <h3 className="text-sm font-semibold text-custom-air-force-blue uppercase tracking-wider">Split Among</h3>
                                <span className="text-xs font-medium text-custom-dark-teal bg-custom-beige px-2 py-1 rounded-lg capitalize">
                                    {expense.split_type === 'equal' ? 'Equally' : expense.split_type}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {split_among.map((split, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                name={split.user_id?.name || 'User'}
                                                profilePicture={split.user_id?.profilePicture}
                                                size="sm"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-custom-ink-black text-sm">
                                                    {split.user_id?.name || 'Unknown User'}
                                                </span>
                                                {/* Show details based on split type */}
                                                {(expense.split_type === 'percentage' || expense.split_type === 'shares') && (
                                                    <span className="text-xs text-custom-air-force-blue">
                                                        {expense.split_type === 'percentage' && `${split.percentage}%`}
                                                        {expense.split_type === 'shares' && `${split.shares} share${split.shares !== 1 ? 's' : ''}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-semibold text-custom-ink-black text-sm">
                                                ₹{(split.amount || 0).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="p-4 border-t border-custom-ash-grey/30 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={() => onDelete(expense)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Expense
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ExpenseDetailsModal;
