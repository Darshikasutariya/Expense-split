import axiosInstance from "./axiosInstance";

export const expenseAPI = {
    addGroupExpense: (groupId, data) => axiosInstance.post(`/expense/add/group/${groupId}`, data),
    addFriendExpense: (friendId, data) => axiosInstance.post(`/expense/add/friend/${friendId}`, data),
    editExpense: (expenseId, data) => axiosInstance.put(`/expense/edit/${expenseId}`, data),
    deleteExpense: (expenseId) => axiosInstance.delete(`/expense/delete/${expenseId}`),
    getFriendExpenses: (friendId, params) => axiosInstance.get(`/expense/getFriendExpenses/${friendId}`, { params }),
    getGroupExpenses: (groupId, params) => axiosInstance.get(`/expense/getGroupExpenses/${groupId}`, { params }),
    getExpenseDetails: (expenseId) => axiosInstance.get(`/expense/getExpenseDetails/${expenseId}`),
};
