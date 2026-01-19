import axiosInstance from "../api/axiosInstance";


export const friendAPI = {
    sendFriendRequest: (reciver_id, data) => axiosInstance.post(`/friend/sendRequest/${reciver_id}`, data),
    acceptFriendRequest: (friendId) => axiosInstance.patch(`/friend/acceptRequest/${friendId}`),
    rejectFriendRequest: (friendId) => axiosInstance.patch(`/friend/rejectRequest/${friendId}`),
    deleteFriendship: (friendId) => axiosInstance.delete(`/friend/deleteFriendship/${friendId}`),
    getFriends: () => axiosInstance.get(`/friend/getFriendList`),
}