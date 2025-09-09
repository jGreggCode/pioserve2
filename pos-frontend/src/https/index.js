import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");
export const getUsers = () => axiosWrapper.get("/api/user/users");

// Table Endpoints
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const freeTable = (tableId) =>
  axiosWrapper.put(`/api/table/free/${tableId}`);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);

// Dish Endpoints
export const addDish = (data) => axiosWrapper.post("/api/dish/", data);
export const getDish = (data) => axiosWrapper.get("/api/dish/", data);

// Payment Endpoints
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment//verify-payment", data);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
export const getAllOrders = () => axiosWrapper.get("/api/order/all");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });
export const getTotal = () => axiosWrapper.get("/api/order/get/totalOrder");
export const getOrdersCount = () => axiosWrapper.get("/api/order/get/getOrdersCount");
export const getCustomerCount = () => axiosWrapper.get("/api/order/get/getCustomerCount");
export const getOrdersByEmployee = (employeeId) => axiosWrapper.get(`/api/order/get/orders/${employeeId}`);
export const getTotalToday = () => axiosWrapper.get("/api/order/get/totalOrderToday");
export const deleteOrder = ({ orderId }) =>
  axiosWrapper.delete(`/api/order/${orderId}`);





