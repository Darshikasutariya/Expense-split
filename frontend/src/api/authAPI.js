import axiosInstance from "./axiosInstance";

export const authAPI = {
    register: (data) => axiosInstance.post("/auth/register", data),
    login: (data) => axiosInstance.post("/auth/login", data),
    logout: () => axiosInstance.post("/auth/logout"),
    forgotPassword: (data) => axiosInstance.post("/auth/forgotpassword", data),
    verifyOTP: (data) => axiosInstance.post("/auth/verifyotp", data),
    resetPassword: (data) => axiosInstance.post("/auth/resetpassword", data),
}