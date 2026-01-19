import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:6001/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


//golbal res
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;