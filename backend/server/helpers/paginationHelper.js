export const getPagination = (req) => {
    const page = parseInt(req.body?.page) || parseInt(req.query?.page) || 1;
    const limit = parseInt(req.body?.limit) || parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;
    return { page, skip, limit };
}

export const hasPagination = (page, limit, total) => {
    const hasNextPage = page < Math.ceil(total / limit);
    const hasPrevPage = page > 1;
    return { hasNextPage, hasPrevPage };
}
