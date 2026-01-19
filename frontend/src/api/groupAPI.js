import axiosInstance from "./axiosInstance";

export const groupAPI = {
    createGroup: (data) => axiosInstance.post(`/group/create`, data),
    updateGroup: (groupId, data) => axiosInstance.put(`/group/edit/${groupId}`, data),
    deleteGroup: (groupId) => axiosInstance.delete(`/group/delete/${groupId}`),
    addMember: (groupId, data) => axiosInstance.post(`/group/addMember/${groupId}`, data),
    removeMember: (groupId, data) => axiosInstance.delete(`/group/removeMember/${groupId}`, { data }),
    getGroups: () => axiosInstance.get(`/group/getGroupList`),
}