import React from 'react';

const UserAvatar = ({
    name,
    profilePicture,
    size = 'md',
    className = ''
}) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl'
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center ${className}`}>
            {profilePicture ? (
                <img
                    src={profilePicture}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-custom-dark-teal text-white flex items-center justify-center font-semibold">
                    {getInitials(name)}
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
