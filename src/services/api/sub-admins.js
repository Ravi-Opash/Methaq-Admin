import axios from "./"; // from interceptor

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const adminAPI = {
  // get company list api
  getAdminsListApi({ page = 1, size = 5, search = "" }) {
    return axios.get(`/api/admin/module/listmoduleaccess?page=${page}&size=${size}&search=${search}`);
  },

  // get company by id api
  getAdminDetailByIdApi(id) {
    return axios.get(`/api/admin/module/${id}/readmoduleaccess`);
  },

  // update company by id api
  updateAdminByIdApi({ data, id }) {
    return axios.post(`/api/admin/module/${id}/updatemoduleaccess`, data);
  },

  // add new company api
  addNewAdminApi(data) {
    return axios.post(`/api/admin/module/createmoduleaccess`, data);
  },

  // delete admin by id api
  deleteAdminByIdApi(id) {
    return axios.delete(`/api/admin/module/${id}/deletemoduleaccess`);
  },

  // change password by admin api
  changePasswordByAdminApi(data, id) {
    return axios.post(`/api/admin/module/${id}/changeagentpassword`, data, config);
  },

  // get list of otor Superviser agent list
  fetchMotorSuperwiserAgentListApi() {
    return axios.get(`/api/admin/module/listofsupervisors`);
  },
};

export default adminAPI;
