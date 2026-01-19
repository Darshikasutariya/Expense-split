import React from 'react';
import UserAvatar from '../common/UserAvatar';
import AmountDisplay from '../common/AmountDisplay';

const GroupCard = ({ group, onClick }) => {
    const { groupName, groupDescription, groupPicture, groupType, groupMembers, stats, createdAt } = group;

    const getGroupTypeIcon = (type) => {
        const icons = {
            trip: '✈️',
            home: '🏠',
            couple: '💑  ',
            friends: '👥',
            family: '👨‍👩‍👧‍👦',
            work: '💼',
            other: '📌'
        };
        return icons[type] || icons.other;
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer border border-custom-ash-grey/30"
        >
            {/* Header with Image */}
            <div className="relative h-32 bg-gradient-to-br from-custom-dark-teal to-custom-air-force-blue">
                {groupPicture ? (
                    <img src={groupPicture} alt={groupName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                        {getGroupTypeIcon(groupType)}
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-custom-dark-teal capitalize">
                    {groupType}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-custom-ink-black text-lg mb-1">{groupName}</h3>
                {groupDescription && (
                    <p className="text-sm text-custom-air-force-blue mb-3 line-clamp-2">{groupDescription}</p>
                )}

                {/* Members */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex -space-x-2">
                        {groupMembers?.slice(0, 4).map((member, index) => (
                            <UserAvatar
                                key={index}
                                name={member.user_id?.name || 'Member'}
                                profilePicture={member.user_id?.profilePicture}
                                size="sm"
                                className="ring-2 ring-white"
                            />
                        ))}
                    </div>
                    <span className="text-sm text-custom-air-force-blue">
                        {stats?.memberCount || groupMembers?.length || 0} members
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-custom-ash-grey/30">
                    <div className="text-center">
                        <p className="text-xs text-custom-air-force-blue">Total Expenses</p>
                        <p className="font-semibold text-custom-ink-black">{stats?.expense || 0}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-custom-air-force-blue">Total Amount</p>
                        <AmountDisplay amount={stats?.amount || 0} size="sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupCard;
