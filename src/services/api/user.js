import axios from "./"; // from interceptor

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const userAPI = {
  // logout admin api
  logoutApi() {
    return axios.get("/api/admin-auth/logout");
  },

  // get admin details api
  getAdminDetailsApi() {
    return axios.get("/api/admin/me");
  },

  //change password api
  ChangeAgentPasswordApi(data) {
    return axios.post("api/user/change-password", data, config);
  },
};

export default userAPI;
