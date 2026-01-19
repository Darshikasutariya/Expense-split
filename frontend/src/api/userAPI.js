import axiosInstance from "./axiosInstance";

export const userAPI = {
    profile: () => axiosInstance.get("/user/profile"),
    updateProfile: (data) => axiosInstance.put("/user/update", data),
    deleteProfile: () => axiosInstance.delete("/user/delete"),
    searchUser: (data) => axiosInstance.get("/user/search", { params: data }),
    getNotification: () => axiosInstance.get("/user/getNotification"),
    updateNotification: (data) => axiosInstance.put("/user/updateNotification", data),
}