import axios from "../";

const requestHandler = (request) => {
  const access_token = localStorage.getItem("accessToken");
  if (access_token) {
    // Modify request here
    request.headers.Authorization = `Bearer ${access_token}`;
    request.headers["x-access-token"] = `${access_token}`;
  }
  return request;
};

axios.interceptors.request.use((request) => requestHandler(request));

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const { response } = error;

    if (response && response.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axios;
