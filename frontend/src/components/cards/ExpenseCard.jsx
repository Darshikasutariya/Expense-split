import React from 'react';
import CategoryIcon from '../common/CategoryIcon';
import AmountDisplay from '../common/AmountDisplay';
import UserAvatar from '../common/UserAvatar';

const ExpenseCard = ({ expense, onClick }) => {
    const { title, description, amount, category, split_type, paid_by, createdAt } = expense;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getSplitTypeLabel = (type) => {
        const labels = {
            equal: 'Split Equally',
            exact: 'Exact Amounts',
            percentage: 'By Percentage',
            shares: 'By Shares'
        };
        return labels[type] || type;
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-custom-ash-grey/30"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="bg-custom-beige p-2 rounded-lg">
                        <CategoryIcon category={category} size="md" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-custom-ink-black text-lg">{title}</h3>
                        {description && (
                            <p className="text-sm text-custom-air-force-blue">{description}</p>
                        )}
                    </div>
                </div>
                <AmountDisplay amount={amount} size="lg" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-custom-ash-grey/30">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-custom-air-force-blue">Paid by</span>
                    <div className="flex -space-x-2">
                        {paid_by?.slice(0, 3).map((payer, index) => (
                            <UserAvatar
                                key={index}
                                name={payer.user_id?.name || 'User'}
                                profilePicture={payer.user_id?.profilePicture}
                                size="sm"
                                className="ring-2 ring-white"
                            />
                        ))}
                        {paid_by?.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-custom-dark-teal text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white">
                                +{paid_by.length - 3}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-custom-air-force-blue">
                    <span>{getSplitTypeLabel(split_type)}</span>
                    <span>•</span>
                    <span>{formatDate(createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCard;
