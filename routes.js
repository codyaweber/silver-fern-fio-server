/*
API route middleware mounting
*/

const root = require("rootrequire");
const express = require("express");
const router = express.Router();

const cache = require(root + "/database/cache");

// Middleware for each API
const shop = require(root + "/apis/shop");
const analytics = require(root + "/apis/analytics");

module.exports = router;

// Shop
  // Items
router.get("/shop/items/:id(\\d+)", cache(), shop.getItemById);
router.get("/shop/items/ids", shop.getItemIds);

  // Orders
router.post("/shop/orders", shop.submitOrder);

// Analytics
router.get("/analytics/orders/ids", analytics.getOrderIds)
router.get("/analytics/orders/:id(\\d+)", cache(), analytics.getOrderById)
router.get("/analytics/items/top/:count(\\d+)", analytics.getTopItems);
router.get("/analytics/customers/top/:count(\\d+)", analytics.getTopCustomers);

  // Customers
router.get("/analytics/customers/ids", analytics.getCustomerIds);
router.get("/analytics/customers/:id(\\d+)", cache(), analytics.getCustomerById);
router.get("/analytics/orders/:id(\\d+)", cache(), analytics.getOrderById);
router.get("/analytics/orders/:id(\\d+)/details", cache(), analytics.getOrderDetails);

// Catch all 404
router.all("*", (req, res, next) => {
  res.sendStatus(404);
})
