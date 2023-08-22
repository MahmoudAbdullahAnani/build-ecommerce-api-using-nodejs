const express = require("express");
const {
  createOrderCash,
  getOrders,
  getSingleOrder,
  getUserOrders,
  createOrderCard,
  clearOrders,
} = require("../services/orderService");
const { protect, allowedTo } = require("../services/authService");
const router = express.Router();

// Create Order Cash And Get All Orders (admin, Manger)
router.route("/cash").post(protect, allowedTo("user"), createOrderCash);
router
  .route("/")
  .get(protect, allowedTo("admin", "manger"), getOrders)
  .delete(protect, allowedTo("admin", "manger"), clearOrders);

// Get My Order
router.route("/me").get(protect, allowedTo("user"), getUserOrders);

// Create Order Card
router.route("/card").post(protect, allowedTo("user"), createOrderCard);

// Get Single Order By Any User
router
  .route("/:orderId")
  .get(protect, allowedTo("user", "admin", "manger"), getSingleOrder);

module.exports = router;
