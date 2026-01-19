import React from 'react';

const AmountDisplay = ({
    amount,
    currency = 'INR',
    type = 'neutral', // 'credit', 'debit', 'neutral'
    size = 'md',
    showSign = false,
    className = ''
}) => {
    const sizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-2xl font-bold'
    };

    const colors = {
        credit: 'text-custom-success-green',
        debit: 'text-red-500',
        neutral: 'text-custom-ink-black'
    };

    const formatAmount = (amt) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(Math.abs(amt));
    };

    const sign = showSign && amount !== 0 ? (amount > 0 ? '+' : '-') : '';

    return (
        <span className={`${sizes[size]} ${colors[type]} font-semibold ${className}`}>
            {sign}{formatAmount(amount)}
        </span>
    );
};

export default AmountDisplay;
