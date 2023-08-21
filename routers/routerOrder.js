const express = require("express");
const {
  createOrderCash,
  getOrders,
  getSingleOrder,
  getUserOrders,
} = require("../services/orderService");
const { protect, allowedTo } = require("../services/authService");
const router = express.Router();

router
  .route("/")
  .post(protect, allowedTo("user"), createOrderCash)
  .get(protect, allowedTo("admin", "manger"), getOrders);

  router.route("/me").get(protect, allowedTo("user"), getUserOrders);





router
  .route("/:orderId")
  .get(protect, allowedTo("user", "admin", "manger"), getSingleOrder);


module.exports = router;
