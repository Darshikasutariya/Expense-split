//date
export const buildDateFilter = (startDate, endDate) => {
    if (!startDate && !endDate) {
        return null;
    }
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.$gte = new Date(startDate);
        dateFilter.$lte = new Date(endDate);
    } else if (startDate) {
        dateFilter.$gte = new Date(startDate);
    } else if (endDate) {
        dateFilter.$lte = new Date(endDate);
    }

    return dateFilter;
}

//amount
export const buildAmountFilter = (minAmount, maxAmount) => {
    const amountFilter = {};

    if (minAmount !== undefined && minAmount !== null) {
        amountFilter.$gte = parseFloat(minAmount);
    }

    if (maxAmount !== undefined && maxAmount !== null) {
        amountFilter.$lte = parseFloat(maxAmount);
    }

    return Object.keys(amountFilter).length > 0 ? amountFilter : null;
};

//search
export const buildTextSearchFilter = (searchText, fields) => {
    if (!searchText || !fields || fields.length === 0) {
        return null;
    }

    const searchRegex = new RegExp(searchText, 'i');
    return {
        $or: fields.map(field => ({ [field]: searchRegex }))
    };
};

//status
export const buildStatusFilter = (status, allowedStatuses) => {
    if (!status) return null;

    if (allowedStatuses && !allowedStatuses.includes(status)) {
        throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`);
    }

    return status;
};

//sort
export const buildSortObject = (sortBy, sortOrder = 'desc') => {
    if (!sortBy) {
        return { createdAt: -1 };
    }

    const order = sortOrder === 'asc' ? 1 : -1;
    return { [sortBy]: order };
};

//apply filters
export const applyFilters = (baseQuery, filters) => {
    const query = { ...baseQuery };

    if (filters.dateField && (filters.startDate || filters.endDate)) {
        const dateFilter = buildDateFilter(filters.startDate, filters.endDate);
        if (dateFilter) {
            query[filters.dateField] = dateFilter;
        }
    }

    if (filters.amountField && (filters.minAmount || filters.maxAmount)) {
        const amountFilter = buildAmountFilter(filters.minAmount, filters.maxAmount);
        if (amountFilter) {
            query[filters.amountField] = amountFilter;
        }
    }

    if (filters.searchText && filters.searchFields) {
        const textFilter = buildTextSearchFilter(filters.searchText, filters.searchFields);
        if (textFilter) {
            if (query.$or) {
                query.$and = [{ $or: query.$or }, textFilter];
                delete query.$or;
            } else {
                Object.assign(query, textFilter);
            }
        }
    }

    if (filters.statusField && filters.status) {
        query[filters.statusField] = filters.status;
    }

    return query;
};

export default {
    buildDateFilter,
    buildAmountFilter,
    buildTextSearchFilter,
    buildStatusFilter,
    buildSortObject,
    applyFilters
};