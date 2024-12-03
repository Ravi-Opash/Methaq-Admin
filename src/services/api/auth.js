import axios from "../index";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const authAPI = {
  // login admin api
  loginApi(data) {
    return axios.post("/api/admin-auth/login", data, config);
  },
};

export default authAPI;
