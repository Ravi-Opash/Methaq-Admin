import axios from "./"; // from interceptor

const productAPI = {
  // get product list
  getProductListApi({ page = 1, size = 5 }) {
    return axios.get(`/api/admin/products/get-product?page=${page}&size=${size}`);
  },

  // get product details by id
  getProductDetailsByIdApi(id) {
    return axios.get(`/api/admin/products/${id}`);
  },

  // create product data
  createProductDataApi(data) {
    return axios.post("/api/admin/products/add-product", data);
  },

  // edit product data
  editProductDataApi({ id, data }) {
    return axios.post(`/api/admin/products/${id}`, data);
  },

  // delete product data
  deleteProductByIdApi(id) {
    return axios.delete(`/api/admin/products/${id}`);
  },

  // change product status
  changeProductStatusByIdApi(data) {
    return axios.post(`/api/admin/products/product-status`, data);
  },
};

export default productAPI;
